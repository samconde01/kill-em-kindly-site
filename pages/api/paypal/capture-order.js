import { addDonor } from '../tracker/_store';

// Little helper: Title Case a string like "john.doe" -> "John Doe"
function titleCaseFromEmailLocal(local) {
  if (!local) return '';
  return local
    .replace(/\./g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(^|\s)\S/g, s => s.toUpperCase());
}

export default async function handler(req, res) {
  try {
    // ---- 0) Read input from client ----
    const { orderID, meta } = req.body || {};
    // meta is optional but recommended: { firstName?: string, anon?: boolean, amount?: number, email?: string }

    if (!orderID) {
      return res.status(400).json({ error: 'Missing orderID' });
    }

    // ---- 1) PayPal OAuth ----
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

    if (!oauth?.access_token) {
      return res.status(502).json({ error: 'paypal-oauth-failed', detail: oauth });
    }

    // ---- 2) Capture the order ----
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

    // ---- 3) Amount / meta parsing ----
    const amount = parseFloat(capture?.amount?.value || meta?.amount || '0');

    // Preserve your T-shirt size extraction
    const sizeFromCustom = (pu?.custom_id || '').startsWith('size:')
      ? (pu.custom_id.split(':')[1] || '')
      : '';

    // Payment source tag (paypal / venmo)
    const paySrc = cap?.payment_source;
    const source =
      paySrc?.venmo ? 'venmo'
      : paySrc?.paypal ? 'paypal'
      : 'paypal';

    // ---- 4) Build the donor name correctly (NO default to Anonymous unless chosen) ----
    const payer = cap?.payer || {};
    const shipping = pu?.shipping || {};
    const shipFull = (shipping?.name?.full_name || '').trim();
    const payerGiven = (payer?.name?.given_name || '').trim();
    const payerEmail = (payer?.email_address || '').trim();
    const emailLocal = payerEmail ? payerEmail.split('@')[0] : '';
    const emailLocalTitle = titleCaseFromEmailLocal(emailLocal);

    // Frontend-provided meta takes priority when not anonymous
    const clientFirst = (meta?.firstName || '').trim();

    // If the donor explicitly picked "anonymous" in our UI, we respect that.
    const isAnonymous = meta?.anon === true;

    // Derive a first name only if NOT anonymous
    let derivedFirstName = null;
    if (!isAnonymous) {
      derivedFirstName =
        clientFirst ||
        (shipFull ? shipFull.split(' ')[0] : '') ||
        payerGiven ||
        emailLocalTitle ||
        null;
    }

    // ---- 5) Only record successful captures ----
    if (status === 'COMPLETED' && amount > 0) {
      // IMPORTANT: addDonor should save first_name + is_anonymous (see note below).
      await addDonor({
        // Keep "name" for backward compatibility in your UI, but compute it the right way:
        // If anonymous, render "Anonymous"; else show first name or "Supporter" as a last resort.
        name: isAnonymous ? 'Anonymous' : (derivedFirstName || 'Supporter'),

        // Also pass structured fields in case your store/DB supports them
        first_name: derivedFirstName,        // null if anonymous
        is_anonymous: isAnonymous,           // true/false (truth source for display)
        email: payerEmail || meta?.email || null,

        amount,
        message: '',                         // keep your message slot (unused today)
        size: sizeFromCustom,                // from create-order custom_id
        source,
        ts: new Date().toISOString(),

        // Forward raw bits in case your store needs them (txn id etc.)
        paypal_txn_id: capture?.id || cap?.id || null
      });
    }

    return res.status(200).json({
      status,
      id: capture?.id,
      // Handy: return what the UI should show *immediately* without refetching
      displayName: isAnonymous ? 'Anonymous' : (derivedFirstName || 'Supporter'),
      raw: cap
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'capture-order failed' });
  }
}
