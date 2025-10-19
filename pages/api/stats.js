// pages/api/stats.js
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit ?? 12), 50);

    const [totalRows, donorRows] = await Promise.all([
      sql`SELECT COALESCE(SUM(amount_cents),0)::int AS total_cents, COUNT(*)::int AS backers FROM donations`,
      sql`SELECT name, amount_cents, created_at FROM donations ORDER BY created_at DESC LIMIT ${limit}`,
    ]);

    const { total_cents, backers } = totalRows[0];

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      total_cents,
      backers,
      donors: donorRows.map(r => ({
        name: r.name || 'Anonymous',
        amount_cents: r.amount_cents,
        created_at: r.created_at,
      })),
    });
  } catch (e) {
    console.error('stats error', e);
    res.status(500).json({ error: 'Failed to load stats' });
  }
}
