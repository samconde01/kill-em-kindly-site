import { getState } from './_store';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  try {
    const { donors, rev } = await getState();
    return res.status(200).json({ donors, rev });
  } catch (e) {
    console.error('tracker/list error', e);
    return res.status(500).json({ error: 'tracker list failed' });
  }
}
