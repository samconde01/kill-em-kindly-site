export default function handler(req, res) {
  const hasKey = !!process.env.ADMIN_KEY && process.env.ADMIN_KEY.length > 0;
  // Do NOT leak the actual key value
  res.status(200).json({ ok: true, hasKey });
}
