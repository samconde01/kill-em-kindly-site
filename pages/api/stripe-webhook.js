export default function handler(req, res) {
  return res.status(410).json({ error: 'Stripe is disabled for this project.' });
}
