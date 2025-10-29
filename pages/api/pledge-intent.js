// pages/api/pledge-intent.js
// Creates/updates a pledge row BEFORE sending the user to PayPal Donations.
// Uses Neon via lib/db (no @vercel/postgres).

import { getSql } from '../../lib/db'; // NOTE: if your lib path differs, mirror what ipn.js uses

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      id,                 // uuid generated client-side
      amount,             // number
      email,              // string
      address,            // object | null
      tShirtSize,         // string | null
      tier,               // string | null
      noReward,           // boolean
      firstName,          // string | null (public tracker)
      anon                // boolean (public tracker anonymity)
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
    a
