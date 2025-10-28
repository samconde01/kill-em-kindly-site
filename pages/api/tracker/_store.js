// tracker/_store.js

// …your existing in-memory or file-backed state…
let state = global._donorState || { rev: 0, donors: [] };
global._donorState = state;

// existing helper you already have
export function addDonor(d) {
  state.donors.unshift({
    // keep prior shape; include optional keys for future
    id: d.id || null,                // customId from client (if available)
    paypal_txn_id: d.paypal_txn_id || null,
    name: d.name || 'Anonymous',
    first_name: d.first_name || null,
    is_anonymous: !!d.is_anonymous,
    amount: d.amount || 0,
    message: d.message || '',
    size: d.size || '',
    source: d.source || 'paypal',
    ts: d.ts || new Date().toISOString()
  });
  state.rev++;
}

// NEW: update name on a single donor; try multiple keys
export function updateDonorName({ tx, id, firstName, anonymous = false }) {
  const needle = (v) => (v || '').toString().trim();
  const match = state.donors.find(d =>
    (tx && needle(d.paypal_txn_id) === needle(tx)) ||
    (id && needle(d.id) === needle(id))
  );

  if (!match) return false;

  // set fields
  match.first_name  = firstName || match.first_name || null;
  match.is_anonymous = !!anonymous;

  // expose a normalized display name for the client
  if (match.is_anonymous) {
    match.name = 'Anonymous';
  } else {
    match.name = match.first_name || match.name || 'Anonymous';
  }

  state.rev++;
  return true;
}

// Optional: expose current state for list API
export function getState() {
  return state;
}
