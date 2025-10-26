// pages/api/tracker/list.js
import { getSql } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const sql = getSql();

    const [{ total }] =
      await sql`select coalesce(sum(amount),0) as total from pledges where status = 'COMPLETED'`;
    const [{ count }] =
      await sql`select count(*)::int as count from pledges where status = 'COMPLETED'`;

    const rows = await sql`
      select
        id::text,
        coalesce(nullif(email, ''), 'anonymous@unknown') as email,
        amount::float as amount,
        coalesce(completed_at, created_at) as ts
      from pledges
      where status = 'COMPLETED'
      order by completed_at desc nulls last
      limit 250
    `;

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      rev: Date.now(),
      donors: rows.map(r => ({
        id: r.id,
        name: r.email ? r.email.split("@")[0] : "Anonymous",
        email: r.email,
        amount: r.amount,
        ts: new Date(r.ts).getTime()
      })),
      totalRaised: Number(total),
      backers: Number(count)
    });
  } catch (e) {
    console.error("tracker list error", e);
    return res.status(500).json({ error: "tracker list failed" });
  }
}
