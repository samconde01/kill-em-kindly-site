// pages/api/checkout.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, noReward, selectedTier } = req.body || {};
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 100) {
      return res.status(400).json({ error: 'Minimum pledge is $1' });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'usd',
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      customer_creation: 'always',                   // helps get name/email reliably

      // Optional: collect shipping if tiers include physical perks
      // shipping_address_collection: { allowed_countries: ['US','CA','GB','AU','NZ'] },

      // Optional: collect T-shirt size as a simple text field
      custom_fields: [
        {
          key: 'shirt_size',
          label: { type: 'custom', custom: 'T-Shirt Size (XS–XXXL)' },
          type: 'text',
          optional: true,
        },
      ],

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedTier ? `Pledge — ${selectedTier}` : 'Pledge — No Reward',
              description: noReward
                ? 'Donation without claiming a reward'
                : 'Pledge toward film rewards',
            },
            unit_amount: amt, // cents
          },
          quantity: 1,
        },
      ],

      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pledge`,

      metadata: {
        selectedTier: selectedTier || '',
        noReward: String(!!noReward),
        // optional future: anonymous: 'true'
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('checkout error', err);
    res.status(500).json({ error: 'Checkout not available' });
  }
}
