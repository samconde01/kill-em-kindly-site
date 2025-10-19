// pages/api/paypal/create-order.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const { amount, tShirtSize } = req.body || {};
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'invalid_amount' });
    }
    if (Number(amount) >= 75 && !tShirtSize) {
      return res.status(400).json({ error: 'size_required_for_75_plus' });
    }

    const base = process.env.NEXT_PUBLIC_PAYPAL_ENV === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    // Get access token
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}` },
      body: new URLSearchParams({ grant_type: 'client_credentials' })
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return res.status(500).json({ error: 'oauth_failed', detail: tokenData });

    // Create order
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'USD',
            value: String(amount)
          },
          custom_id: JSON.stringify({
            campaign: 'kill-em-kindly',
            tierHint: Number(amount) >= 75 ? 'ShirtTierOrAbove' : 'SubShirtTier',
            tShirtSize: Number(amount) >= 75 ? tShirtSize : null
          }).slice(0, 127) // PayPal limit
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW'
      }
    };

    const createRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });
    const order = await createRes.json();
    if (!createRes.ok) return res.status(500).json({ error: 'create_failed', detail: order });

    res.status(200).json({ id: order.id });
  } catch (err) {
    res.status(500).json({ error: 'server_error', detail: String(err) });
  }
}
