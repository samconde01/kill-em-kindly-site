// pages/api/tracker/list.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  // We'll try a few schema shapes until one works.
  const queries = [
    // A) Your current schema (session_id + amount_cents)
    `
      SELECT
        session_id AS id,
        name,
        amount_cents,
        message,
        size,
        source,
        created_at
      FROM donations
      ORDER BY created_at DESC NULLS LAST, session_id DESC
      LIMIT 100
    `,
    // B) Classic numeric id + amount_cents
    `
      SELECT
        id,
        name,
        amount_cents,
        message,
        size,
        source,
        created_at
      FROM donations
      ORDER BY created_at DESC NULLS LAST, id DESC
      LIMIT 100
    `,
    // C) session_id + amount (no amount_cents)
    `
      SELECT
        session_id AS id,
        name,
        amount,           -- dollars as numeric/float
        message,
        size,
        source,
        created_at
      FROM donations
      ORDER BY created_at DESC NULLS LAST, session_id DESC
      LIMIT 100
    `,
    // D) id + amount (no amount_cents)
    `
      SELECT
        id,
        name,
        amount,           -- dollars as numeric/float
        message,
        size,
        source,
        created_at
      FROM donations
      ORDER BY created_at DESC NULLS LAST, id DESC
      LIMIT 100
    `,
  ];

  try {
    let rows = null;
    let lastErr = null;

    for (const sql of queries) {
      try {
        const r = await pool.query(sql);
        rows = r.rows;
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!rows) {
      throw lastErr || new Error('No query succeeded');
    }

    // Normalize into the shape the frontend expects.
    const donors = rows.map((r) => {
      // Prefer amount_cents; if missing, derive from amount (dollars)
      const cents = (r.amount_cents != null)
        ? Number(r.amount_cents)
        : Math.round(Number(r.amount || 0) * 100);

      return {
        id: r.id ?? null, // may be UUID or number
        name: r.name || 'Anonymous',
        amount: Math.max(0, Number((cents / 100).toFixed(2))), // dollars
        message: r.message || '',
        size: r.size || '',
        source: r.source || 'manual',
        ts: r.created_at || null,
      };
    });

    // Use created_at time as a monotonic-ish revision (works for UUIDs too)
    const rev = donors.length && donors[0].ts
      ? new Date(donors[0].ts).getTime()
      : Date.now();

    res.status(200).json({ donors, rev });
  } catch (e) {
    console.error('tracker/list error', e);
    res.status(500).json({
      error: 'tracker list failed',
      detail: String(e?.message || e),
    });
  }
}
