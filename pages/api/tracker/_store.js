// /pages/api/tracker/_store.js
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Create table once (idempotent)
async function ensureSchema() {
  await sql/*sql*/`
    CREATE TABLE IF NOT EXISTS donations (
      id        TEXT PRIMARY KEY,
      name      TEXT NOT NULL,
      amount    NUMERIC NOT NULL,
      message   TEXT,
      size      TEXT,
      source    TEXT,
      ts        TIMESTAMPTZ NOT NULL
    );
  `;
  await sql/*sql*/`
    CREATE INDEX IF NOT EXISTS donations_ts_desc_idx ON donations (ts DESC);
  `;
}

function nowRev() {
  // simple monotonic-ish revision number for stale-response protection
  return Date.now();
}

export async function getStoreMode() {
  return process.env.DATABASE_URL ? 'pg' : 'memory';
}

// If DATABASE_URL is missing, we still expose the same API but with memory fallback
let memory = { donors: [], rev: nowRev() };

export async function listDonors() {
  if (!(process.env.DATABASE_URL)) return memory.donors;

  await ensureSchema();
  const rows = await sql/*sql*/`
    SELECT id, name, amount, message, size, source, ts
    FROM donations
    ORDER BY ts DESC
    LIMIT 500
  `;
  // Convert amount from string -> number
  return rows.map(r => ({
    ...r,
    amount: Number(r.amount)
  }));
}

export async function getState() {
  if (!(process.env.DATABASE_URL)) return memory;

  const donors = await listDonors();
  return { donors, rev: nowRev() };
}

export async function saveState(state) {
  // Not used for Postgres path; present for interface compatibility
  if (!(process.env.DATABASE_URL)) memory = state;
}

export async function addDonor(partial) {
  const rec = {
    id: cryptoRandomId(),
    name: (partial.name || 'Anonymous').toString(),
    amount: Number(partial.amount) || 0,
    message: (partial.message || '').toString(),
    size: (partial.size || '').toString(),
    source: (partial.source || 'manual').toString(),
    ts: partial.ts ? new Date(partial.ts) : new Date()
  };

  if (!(process.env.DATABASE_URL)) {
    // memory fallback
    const donors = [rec, ...memory.donors];
    memory = { donors, rev: nowRev() };
    return memory;
  }

  await ensureSchema();
  await sql/*sql*/`
    INSERT INTO donations (id, name, amount, message, size, source, ts)
    VALUES (${rec.id}, ${rec.name}, ${rec.amount}, ${rec.message}, ${rec.size}, ${rec.source}, ${rec.ts.toISOString()});
  `;

  const donors = await listDonors();
  return { donors, rev: nowRev() };
}

// Tiny UUID-ish generator that works on Node 18+ without extra deps
function cryptoRandomId() {
  // Prefer global crypto if available
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  // Fallback
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
