// pages/api/pledge-intent.js
// Creates/updates a pledge row BEFORE sending the user to PayPal Donations.
// Uses your Neon helper (lib/db). No @vercel/postgres required.

import { getSql } from '../../lib/db'; // if ipn.js lives at pages/api/paypal/ipn.js it uses '../../../lib/db' — this one is one level higher

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      id,            // uuid generated client-side
      amount,        // number
      email,         // string
      address,       // object | null
      tShirtSize,    // string | null
      tier,          // string | null
      noReward,      // boolean
      firstName,     // string | null (public tracker)
      anon           // boolean (public tracker anonymity)
    } = req.body || {};

    // Basic validation
    if (!id) return res.status(400).json({ error: 'Missing id' });
    if (!(Number(amount) > 0)) return res.status(400).json({ error: 'Invalid amount' });
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const sql = getSql();

    // Normalize/prepare fields
    const cleanName = (firstName || '').trim() || null;
    const isAnonymous = Boolean(anon);
    const addrJson = address ? JSON.stringify(address) : null;

    // Upsert pledge as PENDING; store donor display fields now
    await sql`
      insert into pledges (
        id, amount, email, address, t_shirt_size, tier, no_reward,
        name, is_anonymous, source, status, created_at
      ) values (
        ${id}::uuid,
        ${amount},
        ${email},
        ${addrJson}::jsonb,
        ${tShirtSize || null},
        ${tier || null},
        ${!!noReward},
        ${cleanName},
        ${isAnonymous},
        'web',
        'PENDING',
        now()
      )
      on conflict (id) do update
        set amount        = excluded.amount,
            email         = coalesce(pledges.email, excluded.email),
            address       = coalesce(pledges.address, excluded.address),
            t_shirt_size  = coalesce(pledges.t_shirt_size, excluded.t_shirt_size),
            tier          = coalesce(pledges.tier, excluded.tier),
            no_reward     = excluded.no_reward,
            name          = coalesce(pledges.name, excluded.name),
            is_anonymous  = coalesce(pledges.is_anonymous, excluded.is_anonymous),
            source        = coalesce(pledges.source, excluded.source);
    `;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('pledge-intent error', err);
    return res.status(500).json({ error: 'server error' });
  }
}
