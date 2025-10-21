import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { name, amount, message, size, source } = req.body || {};
    if (!name || !amount) return res.status(400).json({ error: 'name and amount are required' });

    await pool.query(
      `INSERT INTO donations (name, amount, message, size, source)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, Number(amount), message || null, size || null, source || 'manual']
    );

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('tracker/add error', e);
    res.status(500).json({ error: 'tracker add failed' });
  }
}
