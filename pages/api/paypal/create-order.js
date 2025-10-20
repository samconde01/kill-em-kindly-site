// pages/api/paypal/create-order.js
const API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const { amount, tShirtSize } = req.body || {};
    const value = Number(amount || 0);
    if (!value || value < 1) return res.status(400).json({ error: 'invalid_amount' });

    // Enforce shirt size only if you really want to block checkout at $75+
    if (value >= 75 && !tShirtSize) {
      return res.status(400).json({ error: 'size_required_for_75_plus' });
    }

    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return res.status(500).json({ error: 'missing_paypal_creds' });
    }

    // --- OAuth
    const basic = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const tokenResp = await fetch(`${API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    const tokenData = await tokenResp.json();
    if (!tokenResp.ok) return res.status(500).json({ error: 'oauth_failed', detail: tokenData });

    // --- Build order
    const currency = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'USD';
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: value.toFixed(2) // PayPal expects a string with 2 decimals
        },
        custom_id: JSON.stringify({
          campaign: 'kill-em-kindly',
          tierHint: value >= 75 ? 'ShirtTierOrAbove' : 'SubShirtTier',
          tShirtSize: value >= 75 ? tShirtSize : null
        }).slice(0, 127),
        description: value >= 75 && tShirtSize ? `Pledge (T-shirt size: ${tShirtSize})` : 'Pledge'
      }],
      application_context: {
        brand_name: "Kill 'Em Kindly",
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
        landing_page: 'NO_PREFERENCE'
      }
    };

    const createResp = await fetch(`${API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });
    const order = await createResp.json();
    if (!createResp.ok) return res.status(500).json({ error: 'create_failed', detail: order });

    return res.status(200).json({ id: order.id });
  } catch (err) {
    console.error('create-order error:', err);
    return res.status(500).json({ error: 'server_error', detail: String(err) });
  }
}
