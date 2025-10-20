import { getStoreMode, listDonors } from './_store';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  const mode = await getStoreMode();
  const donors = await listDonors().catch(() => []);
  res.status(200).json({ mode, count: donors.length });
}
