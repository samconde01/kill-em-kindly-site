import { addDonor } from './_store';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const rec = await addDonor(req.body || {});
    return res.status(200).json({ ok: true, rec });
  } catch (e) {
    console.error('tracker/add error', e);
    return res.status(500).json({ error: 'tracker add failed' });
  }
}
