export const config = { api: { bodyParser: false } };

import { buffer } from "micro";
import { getSql } from "@/lib/db";

async function verifyIPN(raw) {
  const body = `cmd=_notify-validate&${raw.toString("utf8")}`;
  const resp = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const text = await resp.text();
  return text.trim() === "VERIFIED";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const raw = await buffer(req);
    const verified = await verifyIPN(raw);
    if (!verified) {
      console.warn("IPN not verified");
      return res.status(400).end();
    }

    const data = Object.fromEntries(new URLSearchParams(raw.toString("utf8")));

    // Only process Completed
    if (data.payment_status !== "Completed") return res.status(200).end();

    const customId = data.custom;                 // our pledge.id
    const amount = Number(data.mc_gross || 0);
    const txnId = data.txn_id;                    // unique PayPal transaction
    const payerEmail = data.payer_email || null;
    const first = data.first_name || "";
    const last  = data.last_name || "";
    const fullName = (first || last) ? `${first} ${last}`.trim() : null;

    // Optional: assemble address if PayPal sent it
    const addr = (data.address_street || data.address_city || data.address_state || data.address_zip || data.address_country)
      ? {
          line1: data.address_street || "",
          line2: "",
          city: data.address_city || "",
          state: data.address_state || "",
          postal: data.address_zip || "",
          country: data.address_country || ""
        }
      : null;

    const sql = getSql();

    // Idempotency: if txn already recorded (unique paypal_txn_id), do nothing.
    // Mark pledge as COMPLETED; fill any missing bits from PayPal.
    await sql`
      insert into pledges (id, amount, email, address, status, completed_at, paypal_txn_id)
      values (
        ${customId}::uuid,
        ${amount},
        ${payerEmail},
        ${addr ? JSON.stringify(addr) : null}::jsonb,
        'COMPLETED',
        now(),
        ${txnId}
      )
      on conflict (id) do update
        set status = 'COMPLETED',
            completed_at = coalesce(pledges.completed_at, now()),
            paypal_txn_id = coalesce(pledges.paypal_txn_id, ${txnId}),
            amount = coalesce(pledges.amount, excluded.amount),
            email  = coalesce(pledges.email, excluded.email),
            address = coalesce(pledges.address, excluded.address);
    `;

    // You can also store donor display name if you want to show it:
    // Either add a name column to pledges, or compute in the tracker.
    // Example (if you add name text column):
    // await sql`update pledges set name = coalesce(name, ${fullName}) where id = ${customId}::uuid;`

    return res.status(200).end();
  } catch (e) {
    console.error("IPN error", e);
    return res.status(500).end();
  }
}
