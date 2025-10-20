// pages/api/paypal/capture-order.js
const API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const { orderID } = req.body || {};
    if (!orderID) return res.status(400).json({ error: 'missing_order_id' });

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
    if (!tokenResp.ok) {
      return res.status(500).json({ error: 'oauth_failed', detail: tokenData });
    }

    // --- Capture
    const capResp = await fetch(`${API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    const capture = await capResp.json();
    if (!capResp.ok) {
      return res.status(500).json({ error: 'capture_failed', detail: capture });
    }

    // Optional: extract handy fields (payer, amount, meta)
    const pu = capture?.purchase_units?.[0];
    const cap = pu?.payments?.captures?.[0];
    let meta = null;
    try { meta = cap?.custom_id ? JSON.parse(cap.custom_id) : null; } catch {}

    // You could persist a pledge record here (DB call).
    // console.log('PAYPAL CAPTURE OK', {
    //   captureId: cap?.id,
    //   payerEmail: capture?.payer?.email_address,
    //   amount: cap?.amount,
    //   status: cap?.status,
    //   meta
    // });

    return res.status(200).json({
      ok: true,
      id: cap?.id || null,
      status: cap?.status || null,
      amount: cap?.amount || null,
      payer: {
        email: capture?.payer?.email_address || null,
        name: capture?.payer?.name?.given_name ? `${capture.payer.name.given_name} ${capture.payer.name.surname || ''}`.trim() : null
      },
      meta,
      raw: capture // keep raw for your client/devtools; remove later if you want
    });
  } catch (err) {
    console.error('capture-order error:', err);
    return res.status(500).json({ error: 'server_error', detail: String(err) });
  }
}
