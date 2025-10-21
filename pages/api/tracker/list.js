// pages/api/tracker/list.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    // Use session_id (aliased to id) because your table doesn't have an `id` column
    const { rows } = await pool.query(`
      SELECT
        session_id AS id,
        name,
        amount_cents,
        message,
        size,
        source,
        created_at
      FROM donations
      ORDER BY session_id DESC
      LIMIT 100
    `);

    const donors = rows.map(r => ({
      id: r.id,
      name: r.name || 'Anonymous',
      amount: Math.max(0, Number(((Number(r.amount_cents || 0)) / 100).toFixed(2))),
      message: r.message || '',
      size: r.size || '',
      source: r.source || 'manual',
      ts: r.created_at || null,
    }));

    const rev = donors.length ? Number(donors[0].id) : 0;

    res.status(200).json({ donors, rev });
  } catch (e) {
    console.error('tracker/list error', e);
    res.status(500).json({ error: 'tracker list failed', detail: String(e?.message || e) });
  }
}
