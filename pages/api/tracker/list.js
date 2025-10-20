import { listDonors } from './_store';

export const config = { runtime: 'nodejs' }; // ensure Node (not Edge)

export default async function handler(req, res) {
  // Kill CDN/browser caching
  res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  try {
    const donors = await listDonors();
    return res.status(200).json({ donors });
  } catch (e) {
    console.error('tracker/list error', e);
    return res.status(500).json({ error: 'tracker list failed' });
  }
}
