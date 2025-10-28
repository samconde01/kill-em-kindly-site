// pages/api/admin/fix-donor.js
import { updateDonorName, getState } from '../../tracker/_store';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tx, id, firstName, anonymous } = req.body || {};

    if (!firstName && !anonymous) {
      return res.status(400).json({ error: 'Provide firstName and/or anonymous flag' });
    }
    if (!tx && !id) {
      return res.status(400).json({ error: 'Provide tx (paypal_txn_id) or id (customId)' });
    }

    const ok = updateDonorName({
      tx: tx || null,
      id: id || null,
      firstName: firstName || null,
      anonymous: Boolean(anonymous)
    });

    if (!ok) {
      return res.status(404).json({ error: 'Donor not found in tracker store' });
    }

    const { rev, donors } = getState();
    // return the top few for sanity-check
    return res.status(200).json({
      ok: true,
      rev,
      preview: donors.slice(0, 5).map(d => ({
        name: d.name,
        first_name: d.first_name,
        is_anonymous: d.is_anonymous,
        amount: d.amount,
        paypal_txn_id: d.paypal_txn_id,
        id: d.id
      }))
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'fix-donor failed' });
  }
}
