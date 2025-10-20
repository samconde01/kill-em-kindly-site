// pages/api/checkout.js  (stub)
export default function handler(req, res) {
  return res.status(410).json({ error: 'Stripe checkout is disabled. Use PayPal.' });
}
