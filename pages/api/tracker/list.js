import { listDonors } from './_store';

export default async function handler(req, res) {
  try {
    const donors = await listDonors();
    return res.status(200).json({ donors });
  } catch (e) {
    console.error('tracker/list error', e);
    return res.status(500).json({ error: 'tracker list failed' });
  }
}
