// pages/api/tracker/list.js
import { getSql } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const sql = getSql();

    // Sum only completed pledges
    const [{ total }] = await sql`
      select coalesce(sum(amount), 0)::numeric as total
      from pledges
      where status = 'COMPLETED'
    `;

    // Recent donors (include name column!)
    const donors = await sql`
      select
        id,
        amount::numeric as amount,
        name,                  -- <-- use the name you stored
        source,
        coalesce(completed_at, created_at) as ts
      from pledges
      where status = 'COMPLETED'
      order by coalesce(completed_at, created_at) desc
      limit 50
    `;

    // Shape for UI: if name is null/blank, fall back to "Anonymous"
    const out = donors.map(d => ({
      id: d.id,
      amount: Number(d.amount || 0),
      name: (d.name && String(d.name).trim()) || "Anonymous",
      source: d.source || null,
      ts: d.ts
    }));

    // Simple rev to prevent stale client state
    return res.status(200).json({
      totalRaised: Number(total || 0),
      donors: out,
      rev: Date.now()
    });
  } catch (e) {
    console.error("tracker/list error", e);
    return res.status(500).json({ error: "server error" });
  }
}
