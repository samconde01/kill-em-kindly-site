import { addDonor } from '../tracker/_store';

export default async function handler(req, res) {
  try {
    const { orderID } = req.body;
    if (!orderID) return res.status(400).json({ error: 'Missing orderID' });

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const oauth = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    }).then(r => r.json());

    // Capture
    const cap = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${oauth.access_token}`,
        'Content-Type': 'application/json'
      }
    }).then(r => r.json());

    const pu = cap?.purchase_units?.[0];
    const capture = pu?.payments?.captures?.[0];
    const status = cap?.status || capture?.status || 'UNKNOWN';

    // Try to infer details for tracker
    const amount = parseFloat(capture?.amount?.value || '0');
    const sizeFromCustom = (pu?.custom_id || '').startsWith('size:')
      ? (pu.custom_id.split(':')[1] || '')
      : '';
    const payer = cap?.payer;
    const nameGuess = [
      payer?.name?.given_name || '',
      payer?.name?.surname || ''
    ].filter(Boolean).join(' ').trim();

    // Venmo vs PayPal (best-effort)
    const paySrc = cap?.payment_source;
    const source =
      paySrc?.venmo ? 'venmo'
      : paySrc?.paypal ? 'paypal'
      : 'paypal';

    // Only record successful, completed captures
    if (status === 'COMPLETED' && amount > 0) {
      await addDonor({
        name: nameGuess || 'Anonymous',
        amount,
        message: '',           // you can surface a message field if you collect it in UI
        size: sizeFromCustom,  // saved from create-order custom_id
        source,
        ts: new Date().toISOString()
      });
    }

    return res.status(200).json({
      status,
      id: capture?.id,
      raw: cap
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'capture-order failed' });
  }
}
