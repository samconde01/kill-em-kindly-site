// pages/api/tracker/list.js
import { Pool } from 'pg';

let pool;
function getPool() {
  if (!pool) {
    const conn = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!conn) throw new Error('POSTGRES_URL (or DATABASE_URL) is not set');
    pool = new Pool({
      connectionString: conn,
      ssl: { rejectUnauthorized: false }, // works with Neon
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
    await ensure();
    const p = getPool();

    const { rows } = await p.query(
      `SELECT name, amount, message, size, source, created_at
         FROM donations
         ORDER BY created_at DESC
         LIMIT 200`
    );

    const donors = rows.map(r => ({
      name: r.name || 'Anonymous',
      amount: Number(r.amount) || 0,
      message: r.message || '',
      size: r.size || '',
      source: r.source || 'manual',
      ts: r.created_at,
    }));

    // simple rev based on newest row time (or now if empty)
    const rev = donors.length ? Date.parse(donors[0].ts) : Date.now();

    res.status(200).json({ ok: true, donors, rev });
  } catch (e) {
    console.error('tracker/list error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
}
