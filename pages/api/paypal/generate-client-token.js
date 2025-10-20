export default async function handler(req, res) {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    // LIVE OAuth
    const oauthRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    const oauth = await oauthRes.json();
    if (!oauth?.access_token) throw new Error('No access token');

    // LIVE client token
    const tokRes = await fetch('https://api-m.paypal.com/v1/identity/generate-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${oauth.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    const gen = await tokRes.json();

    return res.status(200).json({ clientToken: gen?.client_token || null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to generate client token' });
  }
}
