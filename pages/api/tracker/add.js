// pages/api/tracker/add.js
import { Pool } from 'pg';

let pool;
function getPool() {
  if (!pool) {
    const conn = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!conn) throw new Error('POSTGRES_URL (or DATABASE_URL) is not set');
    pool = new Pool({
      connectionString: conn,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function ensure() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS donations (
      id BIGSERIAL PRIMARY KEY,
      name TEXT,
      amount INT NOT NULL,
      message TEXT,
      size TEXT,
      source TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    await ensure();
    const p = getPool();

    const { name, amount, message, size, source } = req.body || {};
    const amt = Math.round(Number(amount) || 0);
    if (amt <= 0) return res.status(400).json({ ok: false, error: 'amount > 0 required' });

    await p.query(
      `INSERT INTO donations (name, amount, message, size, source)
       VALUES ($1, $2, $3, $4, $5)`,
      [String(name || 'Anonymous'), amt, message || '', size || '', source || 'manual']
    );

    res.status(200).json({ ok: true, rev: Date.now() });
  } catch (e) {
    console.error('tracker/add error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
}
