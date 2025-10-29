// pages/api/tracker/diag.js
import { getStoreMode, listDonors } from "./_store";

export default async function handler(req, res) {
  try {
    const mode = getStoreMode();

    // allow ?limit=NN for quick checks
    const limit = Math.max(1, Math.min(200, Number(req.query.limit || 10)));

    const data = await listDonors(limit);

    return res.status(200).json({
      ok: true,
      mode,
      sampleCount: data.donors.length,
      rev: data.rev,
      donors: data.donors
    });
  } catch (e) {
    console.error("tracker/diag error", e);
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
