// pages/api/admin/fix-donor.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // safe for Neon / many hosted PGs
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Make it crystal-clear what's allowed
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { tx, firstName, anonymous } = req.body || {};
    if (!tx) return res.status(400).json({ error: 'Missing required field: tx (paypal_txn_id / session_id)' });

    const client = await pool.connect();
    try {
      // 1) Primary: update pledges by paypal_txn_id
      const r1 = await client.query(
        `
        UPDATE pledges
        SET
          name = COALESCE($2, name),
          is_anonymous = COALESCE($3::boolean, is_anonymous)
        WHERE paypal_txn_id = $1
        RETURNING id, paypal_txn_id, name, is_anonymous, amount, created_at, completed_at
        `,
        [tx, firstName || null, typeof anonymous === 'boolean' ? anonymous : null]
      );

      let updated = r1.rowCount;
      let preview = r1.rows;

      // 2) Fallback: if nothing matched in pledges, try donations by session_id
      // (Your donations table doesn’t have paypal_txn_id per your schema; session_id is the likely match.)
      if (updated === 0) {
        const r2 = await client.query(
          `
          UPDATE donations
          SET name = COALESCE($2, name)
          WHERE session_id = $1
          RETURNING session_id AS id, name, amount_cents, created_at
          `,
          [tx, firstName || null]
        );
        updated = r2.rowCount;
        preview = r2.rows;
      }

      return res.status(200).json({ ok: true, updated, preview });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('fix-donor error:', err);
    return res.status(500).json({ error: 'fix-donor failed' });
  }
}
