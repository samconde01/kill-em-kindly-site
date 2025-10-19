// pages/api/paypal/generate-client-token.js
export default async function handler(req, res) {
  try {
    const base = process.env.NEXT_PUBLIC_PAYPAL_ENV === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const r = await fetch(`${base}/v1/identity/generate-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: 'client_token_failed', detail: text });
    }

    const data = await r.json(); // { client_token: '...' }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'server_error', detail: String(err) });
  }
}
