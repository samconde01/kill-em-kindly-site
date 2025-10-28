// pages/api/pledge-intent.js
import { sql } from '@vercel/postgres'; // or your Neon client import

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const {
      id,               // the customId you generate on the client
      amount,
      tShirtSize,
      email,
      address,
      tier,
      noReward,
      firstName,        // NEW
      anon              // NEW (boolean)
    } = req.body || {};

    if (!id) return res.status(400).json({ error: 'Missing id' });

    // Make sure there is a pledges row for this id (insert or update your own way).
    // If you already insert earlier, you can skip the INSERT and just do UPDATE.
    await sql`
      INSERT INTO pledges (id, amount, email, t_shirt_size, address, tier, no_reward, status, created_at)
      VALUES (${id}, ${amount || null}, ${email || null}, ${tShirtSize || null}, ${address || null}::jsonb, ${tier || null}, ${!!noReward}, 'PENDING', NOW())
      ON CONFLICT (id) DO UPDATE SET
        amount = EXCLUDED.amount,
        email = EXCLUDED.email,
        t_shirt_size = EXCLUDED.t_shirt_size,
        address = EXCLUDED.address,
        tier = EXCLUDED.tier,
        no_reward = EXCLUDED.no_reward
    `;

    // Save donor display prefs ASAP so IPN can fall back to them.
    await sql`
      UPDATE pledges
      SET first_name = ${firstName || null},
          is_anonymous = ${!!anon}
      WHERE id = ${id}
    `;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('pledge-intent failed', err);
    return res.status(500).json({ error: 'pledge-intent failed' });
  }
}
