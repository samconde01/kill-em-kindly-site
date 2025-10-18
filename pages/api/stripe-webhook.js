import { buffer } from 'micro';
import Stripe from 'stripe';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const PHYSICAL_TIERS = new Set(['ARMORER', 'LOCAL LEADER', 'STRONG BACK', 'OVERSEER']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object;
    const tier = (s.metadata?.selectedTier || '').toUpperCase();
    const isPhysical = tier && PHYSICAL_TIERS.has(tier);
    const country = s.customer_details?.address?.country || '';

    if (isPhysical && country !== 'US') {
      if (typeof s.payment_intent === 'string') {
        try { await stripe.refunds.create({ payment_intent: s.payment_intent, reason: 'requested_by_customer' }); } catch {}
      }
      return res.json({ received: true, rejected: true });
    }

    // TODO: save donor (email, amount, tier, country) to your DB or JSON
  }

  res.json({ received: true });
}
