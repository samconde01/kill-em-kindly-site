import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT name, amount, message, size, source, created_at AS ts
       FROM donations
       ORDER BY created_at DESC
       LIMIT 200`
    );

    // monotonic-ish revision based on the latest row time
    const { rows: r2 } = await pool.query(
      `SELECT EXTRACT(EPOCH FROM COALESCE(MAX(created_at), now()))::bigint AS rev
       FROM donations`
    );

    res.status(200).json({ donors: rows, rev: Number(r2[0].rev || 0) });
  } catch (e) {
    console.error('tracker/list error', e);
    res.status(500).json({ error: 'tracker list failed' });
  }
}
