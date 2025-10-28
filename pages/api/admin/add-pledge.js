// pages/api/admin/add-pledge.js
import { getSql } from "../../../lib/db";

// Server-side admin header secret
const ADMIN_KEY = process.env.ADMIN_KEY || "";

// Minimal UUID v4 generator (in case crypto.randomUUID is unavailable)
function v4() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  // RFC4122-ish fallback
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
  if (key !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });

  try {
    const body = req.body || {};
    const amount = Number(body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ error: "Valid amount required" });

    const sql = getSql();

    // Ensure a proper UUID string for the id column (uuid type)
    const id = v4();

    const name       = body.name ? String(body.name) : null;
    const email      = body.email ? String(body.email) : null;
    const addressObj = body.address && typeof body.address === "object" ? body.address : null;
    const address    = addressObj ? JSON.stringify(addressObj) : null;

    // Count now (COMPLETED) vs log only (PLEDGED)
    const status       = body.status === "PLEDGED" ? "PLEDGED" : "COMPLETED";
    const completedAt  = status === "COMPLETED" ? new Date().toISOString() : null;

    // Insert with explicit casts for uuid/jsonb to match your schema
    await sql`
      insert into pledges (
        id, amount, email, address, status, completed_at, paypal_txn_id, name, source
      ) values (
        ${id}::uuid,
        ${amount},
        ${email},
        ${address}::jsonb,
        ${status},
        ${completedAt},
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
