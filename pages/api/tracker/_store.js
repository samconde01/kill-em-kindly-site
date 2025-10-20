// Minimal storage layer: uses Vercel KV if configured; otherwise in-memory.
// In-memory will reset on cold starts — good enough for dev. KV = persistent.

const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// KV REST helper
async function kv(cmd, ...args) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([cmd, ...args])
  });
  if (!r.ok) throw new Error(`KV ${cmd} failed`);
  return r.json();
}

const KEY = 'donors';

let mem = []; // fallback memory store

export async function addDonor(rec) {
  const safe = {
    name: rec?.name || 'Anonymous',
    amount: Number(rec?.amount) || 0,
    message: rec?.message || '',
    size: rec?.size || '',
    source: rec?.source || 'paypal',
    ts: rec?.ts || new Date().toISOString(),
  };

  if (hasKV) {
    // RPUSH donors "<json>"
    await kv('RPUSH', KEY, JSON.stringify(safe));
    // Optional: trim to last 1000 entries to keep list bounded
    await kv('LTRIM', KEY, '-1000', '-1');
  } else {
    mem.push(safe);
    if (mem.length > 1000) mem = mem.slice(-1000);
  }
  return safe;
}

export async function listDonors() {
  if (hasKV) {
    // LRANGE donors 0 -1
    const out = await kv('LRANGE', KEY, '0', '-1');
    const items = (out?.result || []).map(s => {
      try { return JSON.parse(s); } catch { return null; }
    }).filter(Boolean);
    // newest last -> sort desc by ts
    items.sort((a, b) => (a.ts > b.ts ? -1 : 1));
    return items;
  }
  // memory
  return [...mem].sort((a, b) => (a.ts > b.ts ? -1 : 1));
}
