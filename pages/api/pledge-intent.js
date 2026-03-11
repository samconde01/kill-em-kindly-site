// pages/api/pledge-intent.js
// Creates/updates a pledge row BEFORE sending the user to PayPal Donations.
// Uses your Neon helper (lib/db). No @vercel/postgres required.

import { getSql } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      id,            // uuid generated client-side
      amount,        // total calculated donation
      email,         // donor email
      firstName,     // donor first name
      anon,          // public tracker anonymity
      willAttend,    // yes | no
      needsAda,      // yes | no | null
      ticketCount,   // integer
      shirtCount,    // integer
      shirtSizes     // array of sizes
    } = req.body || {};

    // Basic validation
    if (!id) return res.status(400).json({ error: 'Missing id' });
    if (!(Number(amount) > 0)) return res.status(400).json({ error: 'Invalid amount' });
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!willAttend) return res.status(400).json({ error: 'Missing attendance selection' });
    if (willAttend === 'yes' && !needsAda) {
      return res.status(400).json({ error: 'Missing ADA selection' });
    }

    const parsedTicketCount = Number(ticketCount || 0);
    const parsedShirtCount = Number(shirtCount || 0);
    const parsedShirtSizes = Array.isArray(shirtSizes) ? shirtSizes : [];

    if (parsedTicketCount < 1) {
      return res.status(400).json({ error: 'At least one ticket is required' });
    }

    if (parsedShirtCount < 0) {
      return res.status(400).json({ error: 'Invalid shirt count' });
    }

    if (parsedShirtCount > parsedTicketCount) {
      return res.status(400).json({ error: 'Shirts cannot exceed ticket count' });
    }

    if (parsedShirtSizes.length !== parsedShirtCount) {
      return res.status(400).json({ error: 'Shirt sizes do not match shirt count' });
    }

    if (parsedShirtSizes.some((s) => !s || typeof s !== 'string')) {
      return res.status(400).json({ error: 'Missing shirt size selection' });
    }

    const sql = getSql();

    // Normalize/prepare fields
    const cleanFirstName = (firstName || '').trim() || null;
    const isAnonymous = Boolean(anon);
    const cleanWillAttend = willAttend === 'yes' ? 'yes' : 'no';
    const cleanNeedsAda = cleanWillAttend === 'yes' ? (needsAda === 'yes' ? 'yes' : 'no') : null;
    const shirtSizesJson = JSON.stringify(parsedShirtSizes);

    // Upsert pledge as PENDING; store donor selections before PayPal redirect
    await sql`
      insert into pledges (
        id,
        amount,
        email,
        name,
        first_name,
        is_anonymous,
        will_attend,
        needs_ada,
        ticket_count,
        shirt_count,
        shirt_sizes,
        source,
        status,
        created_at
      ) values (
        ${id}::uuid,
        ${Number(amount)},
        ${email},
        ${cleanFirstName},
        ${cleanFirstName},
        ${isAnonymous},
        ${cleanWillAttend},
        ${cleanNeedsAda},
        ${parsedTicketCount},
        ${parsedShirtCount},
        ${shirtSizesJson}::jsonb,
        'web',
        'PENDING',
        now()
      )
      on conflict (id) do update
        set amount        = excluded.amount,
            email         = excluded.email,
            name          = excluded.name,
            first_name    = excluded.first_name,
            is_anonymous  = excluded.is_anonymous,
            will_attend   = excluded.will_attend,
            needs_ada     = excluded.needs_ada,
            ticket_count  = excluded.ticket_count,
            shirt_count   = excluded.shirt_count,
            shirt_sizes   = excluded.shirt_sizes,
            source        = excluded.source;
    `;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('pledge-intent error', err);
    return res.status(500).json({ error: 'server error' });
  }
}
