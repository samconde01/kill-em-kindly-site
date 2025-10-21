// pages/api/tracker/list.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    // Pull the latest 100 donors. Make sure we SELECT the `id` column explicitly.
    const { rows } = await pool.query(`
      SELECT id, name, amount_cents, message, size, source, created_at
      FROM donations
      ORDER BY id DESC
      LIMIT 100
    `);

    // Convert cents -> dollars for the UI
    const donors = rows.map(r => {
      const cents = Number(r.amount_cents ?? 0);
      const dollars = Math.max(0, Number((cents / 100).toFixed(2)));
      return {
        id: r.id,
        name: r.name || 'Anonymous',
        amount: dollars,
        message: r.message || '',
        size: r.size || '',
        source: r.source || 'manual',
        ts: r.created_at || null,
      };
    });

    // Simple revision so the client can ignore stale responses
    const rev = donors.length ? Number(donors[0].id) : 0;

    res.status(200).json({ donors, rev });
  } catch (e) {
    console.error('tracker/list error', e);
    res.status(500).json({ error: 'tracker list failed', detail: String(e?.message || e) });
  }
}
