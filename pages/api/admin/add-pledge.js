// pages/api/admin/add-pledge.js
import { getSql } from "@/lib/db";

// Protect with a simple header secret in Vercel env
const ADMIN_KEY = process.env.ADMIN_KEY || "";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!ADMIN_KEY) return res.status(500).json({ error: "ADMIN_KEY not configured" });

  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });

  try {
    const body = req.body || {};
    const amount = Number(body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ error: "Valid amount required" });

    const id  = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
    const sql = getSql();

    const name    = body.name ? String(body.name) : null;
    const email   = body.email ? String(body.email) : null;
    const address = body.address ? JSON.stringify(body.address) : null;

    // Choose whether this counts immediately:
    // Use 'COMPLETED' to include in totals now; use 'PLEDGED' if you only want it recorded.
    const status  = body.status === "PLEDGED" ? "PLEDGED" : "COMPLETED";

    await sql`
      insert into pledges (id, amount, email, address, status, completed_at, paypal_txn_id, name, source)
      values (
        ${id},
        ${amount},
        ${email},
        ${address}::jsonb,
        ${status},
        case when ${status} = 'COMPLETED' then now() else null end,
        ${'OFFLINE-' + Date.now()},
        ${name},
        'offline'
      )
    `;

    return res.status(200).json({ ok: true, id, amount, name, status });
  } catch (e) {
    console.error("admin add-pledge error", e);
    return res.status(500).json({ error: "server error" });
  }
}
