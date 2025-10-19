// /pages/api/checkout.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // or your chosen pinned version
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, noReward, selectedTier } = req.body;

    const value = Number(amount);
    if (!value || value < 1) {
      return res.status(400).json({ error: 'Amount must be at least $1' });
    }

    // Business rules
    const needsUSOnlyShipping = !noReward && value >= 20;
    const includesShirt = !noReward && value >= 75; // shirt from $75+

    // Basic product label
    const productLabel = noReward
      ? `Donation — $${value}`
      : selectedTier
        ? `${selectedTier} — $${value}`
        : `Pledge — $${value}`;

    // Build Checkout Session params
    const params = {
      mode: 'payment',
      submit_type: 'donate',
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(value * 100),
            product_data: {
              name: productLabel,
              // Put useful metadata on the product line (surfaces in the dashboard)
              metadata: {
                selectedTier: selectedTier || '',
                noReward: String(!!noReward),
              },
            },
          },
          quantity: 1,
        },
      ],
      // success/cancel
      success_url: `${getBaseUrl(req)}/?pledge=success`,
      cancel_url: `${getBaseUrl(req)}/?pledge=cancel`,
      // Collect email so you can reconcile donations
      customer_creation: 'if_required',
    };

    // If rewards are being claimed (>= $20 & not "donate without reward"),
    // lock shipping to US only.
    if (needsUSOnlyShipping) {
      params.shipping_address_collection = {
        allowed_countries: ['US'],
      };
    }

    // Add custom field for shirt sizes when applicable (>= $75 & rewards claimed)
    if (includesShirt) {
      params.custom_fields = [
        {
          key: 'shirt_size',
          label: { custom: 'T-Shirt Size' },
          type: 'dropdown',
          optional: false, // required
          dropdown: {
            options: [
              { label: 'XS', value: 'XS' },
              { label: 'S',  value: 'S'  },
              { label: 'M',  value: 'M'  },
              { label: 'L',  value: 'L'  },
              { label: 'XL', value: 'XL' },
              { label: '2XL', value: '2XL' },
              { label: '3XL', value: '3XL' },
            ],
          },
        },
      ];
    }

    // Create session
    const session = await stripe.checkout.sessions.create(params);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Checkout not available' });
  }
}

// Helper: figure out your site origin for redirects
function getBaseUrl(req) {
  // Prefer vercel-provided host, else fallback to localhost
  const host =
    req.headers['x-forwarded-host'] ||
    req.headers.host ||
    'localhost:3000';

  const proto =
    (req.headers['x-forwarded-proto'] && Array.isArray(req.headers['x-forwarded-proto'])
      ? req.headers['x-forwarded-proto'][0]
      : req.headers['x-forwarded-proto']) ||
    (host.includes('localhost') ? 'http' : 'https');

  return `${proto}://${host}`;
}
// /pages/api/checkout.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20', // or your chosen pinned version
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, noReward, selectedTier } = req.body;

    const value = Number(amount);
    if (!value || value < 1) {
      return res.status(400).json({ error: 'Amount must be at least $1' });
    }

    // Business rules
    const needsUSOnlyShipping = !noReward && value >= 20;
    const includesShirt = !noReward && value >= 75; // shirt from $75+

    // Basic product label
    const productLabel = noReward
      ? `Donation — $${value}`
      : selectedTier
        ? `${selectedTier} — $${value}`
        : `Pledge — $${value}`;

    // Build Checkout Session params
    const params = {
      mode: 'payment',
      submit_type: 'donate',
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(value * 100),
            product_data: {
              name: productLabel,
              // Put useful metadata on the product line (surfaces in the dashboard)
              metadata: {
                selectedTier: selectedTier || '',
                noReward: String(!!noReward),
              },
            },
          },
          quantity: 1,
        },
      ],
      // success/cancel
      success_url: `${getBaseUrl(req)}/?pledge=success`,
      cancel_url: `${getBaseUrl(req)}/?pledge=cancel`,
      // Collect email so you can reconcile donations
      customer_creation: 'if_required',
    };

    // If rewards are being claimed (>= $20 & not "donate without reward"),
    // lock shipping to US only.
    if (needsUSOnlyShipping) {
      params.shipping_address_collection = {
        allowed_countries: ['US'],
      };
    }

    // Add custom field for shirt sizes when applicable (>= $75 & rewards claimed)
    if (includesShirt) {
      params.custom_fields = [
        {
          key: 'shirt_size',
          label: { custom: 'T-Shirt Size' },
          type: 'dropdown',
          optional: false, // required
          dropdown: {
            options: [
              { label: 'XS', value: 'XS' },
              { label: 'S',  value: 'S'  },
              { label: 'M',  value: 'M'  },
              { label: 'L',  value: 'L'  },
              { label: 'XL', value: 'XL' },
              { label: '2XL', value: '2XL' },
              { label: '3XL', value: '3XL' },
            ],
          },
        },
      ];
    }

    // Create session
    const session = await stripe.checkout.sessions.create(params);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Checkout not available' });
  }
}

// Helper: figure out your site origin for redirects
function getBaseUrl(req) {
  // Prefer vercel-provided host, else fallback to localhost
  const host =
    req.headers['x-forwarded-host'] ||
    req.headers.host ||
    'localhost:3000';

  const proto =
    (req.headers['x-forwarded-proto'] && Array.isArray(req.headers['x-forwarded-proto'])
      ? req.headers['x-forwarded-proto'][0]
      : req.headers['x-forwarded-proto']) ||
    (host.includes('localhost') ? 'http' : 'https');

  return `${proto}://${host}`;
}
