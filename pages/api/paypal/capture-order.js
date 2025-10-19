// pages/api/paypal/capture-order.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const { orderID } = req.body || {};
    if (!orderID) return res.status(400).json({ error: 'missing_order_id' });

    const base = process.env.NEXT_PUBLIC_PAYPAL_ENV === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    // OAuth
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}` },
      body: new URLSearchParams({ grant_type: 'client_credentials' })
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return res.status(500).json({ error: 'oauth_failed', detail: tokenData });

    // Capture
    const capRes = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    const capture = await capRes.json();
    if (!capRes.ok) return res.status(500).json({ error: 'capture_failed', detail: capture });

    // Pull back our metadata for your DB
    const pu = capture?.purchase_units?.[0];
    let meta = null;
    try { meta = pu?.payments?.captures?.[0]?.custom_id ? JSON.parse(pu.payments.captures[0].custom_id) : null; } catch {}
    // If custom_id didn’t propagate on capture, fallback to order GET (optional)
    // You can store `meta?.tShirtSize` with your pledge record here.

    res.status(200).json({ capture });
  } catch (err) {
    res.status(500).json({ error: 'server_error', detail: String(err) });
  }
}
