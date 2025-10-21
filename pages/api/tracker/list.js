// pages/api/tracker/list.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    // Use columns that safely exist: id, amount_cents, etc.
    const { rows } = await pool.query(`
      SELECT
        id,
        COALESCE(amount_cents, 0) AS amount_cents,
        name,
        message,
        size,
        source,
        -- if you have created_at use it; if not, id gives stable newest-first
        created_at
      FROM donations
      ORDER BY id DESC
      LIMIT 200
    `);

    // Shape for the frontend: derive amount from amount_cents
    const donors = rows.map(r => ({
      name: r.name || 'Anonymous',
      amount: Number((Number(r.amount_cents || 0) / 100).toFixed(2)),
      message: r.message || '',
      size: r.size || '',
      source: r.source || 'manual',
      ts: r.created_at || null
    }));

    // Optional "rev" to bust caches
    res.status(200).json({
      donors,
      rev: Date.now()
    });
  } catch (e) {
    console.error('tracker/list error', e);
    res.status(500).json({ error: 'tracker list failed', detail: e.message });
  }
}
