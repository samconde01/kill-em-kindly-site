import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const PHYSICAL_TIERS = new Set(['ARMORER', 'LOCAL LEADER', 'STRONG BACK', 'OVERSEER']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { amount, noReward, selectedTier } = req.body || {};
    const cents = Math.max(100, Math.min(Number(amount || 0), 5_000_000)); // $1–$50k
    const isTier = Boolean(selectedTier) && !noReward;
    const isPhysical = isTier && PHYSICAL_TIERS.has(String(selectedTier));

    const line_items = [{
      price_data: {
        currency: 'usd',
        product_data: { name: isTier ? `Tier: ${selectedTier}` : 'Donation' },
        unit_amount: cents
      },
      quantity: 1
    }];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=1`,
      shipping_address_collection: isPhysical ? { allowed_countries: ['US'] } : undefined,
      automatic_tax: { enabled: false },
      allow_promotion_codes: false,
      metadata: {
        selectedTier: selectedTier || '',
        noReward: String(noReward),
        uiAmountCents: String(cents)
      },
      payment_intent_data: {
        metadata: {
          selectedTier: selectedTier || '',
          uiAmountCents: String(cents)
        }
      }
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: { message: err.message } });
  }
}
