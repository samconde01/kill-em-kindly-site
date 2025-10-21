// pages/api/tracker/add.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { name, amount, message, size, source } = req.body || {};
    const amountNumber = Number(amount);

    if (!name || !amountNumber) {
      return res.status(400).json({ error: 'name and amount are required' });
    }

    const amountCents = Math.round(amountNumber * 100);

    // IMPORTANT: only write amount_cents, not "amount"
    await pool.query(
      `INSERT INTO donations (name, amount_cents, message, size, source)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, amountCents, message || null, size || null, source || 'manual']
    );

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('tracker/add error', e);
    // surface the message to help debugging if something else pops up
    res.status(500).json({ error: 'tracker add failed', detail: e.message });
  }
}
