import { addDonor } from './_store';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const next = await addDonor(req.body || {});
    return res.status(200).json({ ok: true, donors: next.donors, rev: next.rev });
  } catch (e) {
    console.error('tracker/add error', e);
    return res.status(500).json({ error: 'tracker add failed' });
  }
}
