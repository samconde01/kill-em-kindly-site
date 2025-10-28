// pages/api/admin/add-pledge.js
import { getSql } from "../../../lib/db";

const ADMIN_KEY = process.env.ADMIN_KEY || "";

// Minimal UUID v4 generator (works if crypto.randomUUID is unavailable)
function v4() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!ADMIN_KEY) return res.status(500).json({ error: "ADMIN_KEY not configured" });

  const key = req.headers["x-admin-key"];
  const authed = key === ADMIN_KEY;
  if (!authed) return res.status(401).json({ error: "Unauthorized" });

  try {
    const body = req.body || {};
    const amount = Number(body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ error: "Valid amount required" });

    const sql = getSql();
    const id          = v4(); // your table's id is uuid
    const name        = body.name ? String(body.name) : null;
    const email       = body.email ? String(body.email) : null;
    const tShirtSize  = body.tShirtSize ? String(body.tShirtSize) : null; // column exists in your schema
    const tier        = body.tier ? String(body.tier) : null;             // column exists in your schema
    const noReward    = body.noReward === true;                            // default false
    const addressObj  = body.address && typeof body.address === "object" ? body.address : null;
    const address     = addressObj ? JSON.stringify(addressObj) : null;

    const status      = body.status === "PLEDGED" ? "PLEDGED" : "COMPLETED";
    const createdAt   = new Date().toISOString();
    const completedAt = status === "COMPLETED" ? createdAt : null;

    // Insert ALL known columns so we won't trip NOT NULL constraints
    await sql`
      insert into pledges (
        id, amount, email, t_shirt_size, address, tier, no_reward,
        status, created_at, completed_at, paypal_txn_id, name, source
      ) values (
        ${id}::uuid,
        ${amount},
        ${email},
        ${tShirtSize},
        ${address}::jsonb,
        ${tier},
        ${noReward},
        ${status},
        ${createdAt},
        ${completedAt},
        ${'OFFLINE-' + Date.now()},
        ${name},
        'offline'
      )
    `;

    return res.status(200).json({ ok: true, id, amount, name, status });
  } catch (e) {
    // TEMP: echo error details back only to authenticated admin to speed debug
    console.error("admin add-pledge error", e);
    return res.status(500).json({ error: "server error", detail: String(e?.message || e) });
  }
}
