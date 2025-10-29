// pages/api/paypal/ipn.js
export const config = { api: { bodyParser: false } };

import getRawBody from "raw-body";
import { getSql } from "../../../lib/db";

// --- IPN verification ------------------------------------------------------
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
    const raw = await getRawBody(req);
    const verified = await verifyIPN(raw);
    if (!verified) {
      console.warn("IPN not verified");
      return res.status(400).end();
    }

    // Parse the IPN payload (key=value&key=value...)
    const data = Object.fromEntries(new URLSearchParams(raw.toString("utf8")));

    // Only finalize Completed payments
    if (data.payment_status !== "Completed") return res.status(200).end();

    // --- Values we expect from PayPal --------------------------------------
    const customId = (data.custom || "").trim();             // our pledge.id (uuid)
    const amount = Number(data.mc_gross || 0);
    const txnId = (data.txn_id || "").trim();

    // Prefer payer_email; fall back to other known fields if present
    const payerEmail =
      (data.payer_email ||
        data.receiver_email ||
        data.payment_email ||
        "")
        .toString()
        .trim()
        .toLowerCase() || null;

    // STEP 2: Enrich display name fields from PayPal (used only as fallback)
    const payerFirst = (data.first_name || "").toString().trim();
    const payerLast  = (data.last_name  || "").toString().trim();
    const payerFull  = [payerFirst, payerLast].filter(Boolean).join(" ") || null;

    // Optional: assemble address if PayPal sent it
    const addr =
      (data.address_street ||
        data.address_city ||
        data.address_state ||
        data.address_zip ||
        data.address_country)
        ? {
            line1: data.address_street || "",
            line2: "",
            city:  data.address_city   || "",
            state: data.address_state  || "",
            postal: data.address_zip   || "",
            country: data.address_country || ""
          }
        : null;

    if (!customId) {
      console.error("IPN missing custom pledge id; refusing to mutate.");
      return res.status(200).end(); // swallow to avoid retries storm
    }

    const sql = getSql();

    // Idempotent upsert: mark pledge COMPLETED; fill missing bits from PayPal
    // We only use PayPal-provided name/email/address as *fallbacks* so we don't
    // overwrite values captured earlier by /api/pledge-intent.
    await sql`
      insert into pledges (
        id,
        amount,
        email,
        address,
        status,
        completed_at,
        paypal_txn_id,
        name,
        first_name,
        is_anonymous,
        source
      )
      values (
        ${customId}::uuid,
        ${amount},
        ${payerEmail},
        ${addr ? JSON.stringify(addr) : null}::jsonb,
        'COMPLETED',
        now(),
        ${txnId},
        ${payerFull},          -- name (fallback)
        ${payerFirst || null}, -- first_name (fallback)
        false,                 -- default public unless user set anon in intent
        'paypal:ipn'
      )
      on conflict (id) do update
        set status        = 'COMPLETED',
            completed_at  = coalesce(pledges.completed_at, now()),
            paypal_txn_id = coalesce(pledges.paypal_txn_id, excluded.paypal_txn_id),
            amount        = coalesce(pledges.amount, excluded.amount),
            email         = coalesce(pledges.email, excluded.email),
            address       = coalesce(pledges.address, excluded.address),
            -- keep user-entered values; otherwise use PayPal fallbacks
            name          = coalesce(pledges.name, excluded.name),
            first_name    = coalesce(pledges.first_name, excluded.first_name),
            -- honor prior setting from pledge-intent; otherwise default false
            is_anonymous  = coalesce(pledges.is_anonymous, excluded.is_anonymous),
            source        = coalesce(pledges.source, excluded.source);
    `;

    return res.status(200).end();
  } catch (e) {
    console.error("IPN error", e);
    return res.status(500).end();
  }
}
