import { getSql } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const sql = getSql();

    // Pull the recent completed pledges.
    // If your column names differ, adjust here.
    const rows = await sql/*sql*/`
      select
        id,
        amount,
        coalesce(completed_at, created_at) as ts,
        is_anonymous,
        first_name,
        name
      from pledges
      where status = 'COMPLETED'
      order by coalesce(completed_at, created_at) desc, id desc
      limit 250
    `;

    // Compute display_name by the rules
    const donors = rows.map(r => {
      let display = 'Anonymous';
      if (!r.is_anonymous) {
        if (r.first_name && r.first_name.trim()) {
          display = r.first_name.trim();
        } else if (r.name && r.name.trim()) {
          display = r.name.trim().split(/\s+/)[0]; // first token
        }
      }
      return {
        id: r.id,
        name: display,             // UI will just use this
        amount: Number(r.amount) || 0,
        ts: r.ts
      };
    });

    // Optional revision counter so the UI can ignore stale updates
    const rev = Date.now();

    res.status(200).json({ donors, rev });
  } catch (e) {
    console.error("tracker/list error", e);
    res.status(500).json({ error: "Tracker list failed" });
  }
}
