export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET' });
  }

  // Get OAuth access token
  const basic = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const tokenResp = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!tokenResp.ok) {
    const t = await tokenResp.text();
    return res.status(500).json({ error: 'Failed to get access token', detail: t });
  }
  const { access_token } = await tokenResp.json();

  // Generate client token for Hosted Fields
  const ctResp = await fetch('https://api-m.sandbox.paypal.com/v1/identity/generate-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  const data = await ctResp.json();
  if (!ctResp.ok) return res.status(500).json({ error: 'Failed to generate client token', detail: data });
  return res.status(200).json({ client_token: data.client_token });
}
