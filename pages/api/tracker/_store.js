// pages/api/tracker/_store.js
import { getSql } from "../../../lib/db";

/**
 * Returns the tracker store mode. If you later add an in-memory fallback,
 * you can make this conditional. For now, always "db".
 */
export function getStoreMode() {
  return "db";
}

/**
 * Canonical display-name resolver for a donor row.
 * - If anonymous: "Anonymous"
 * - Else prefer name
 * - Else fall back to local-part of email
 * - Else "Backer"
 */
function resolveDisplayName(row) {
  if (row.is_anonymous === true) return "Anonymous";
  if (row.name && row.name.trim().length) return row.name.trim();
  if (row.email && row.email.includes("@")) {
    const local = row.email.split("@")[0].trim();
    if (local) return local;
  }
  return "Backer";
}

/**
 * List donors for the public tracker.
 * Returns: { donors: [{id,name,amount,ts}], rev }
 *
 * Sort: completed_at DESC, then created_at DESC
 * Note: amount is numeric in your schema; we coerce to Number for JSON.
 */
export async function listDonors(limit = 50) {
  const sql = getSql();

  const rows = await sql`
    select
      id,
      name,
      email,
      is_anonymous,
      amount,
      coalesce(completed_at, created_at) as ts
    from pledges
    where status = 'COMPLETED'
    order by coalesce(completed_at, created_at) desc, id desc
    limit ${limit}
  `;

  const donors = rows.map(r => ({
    id: String(r.id),
    name: resolveDisplayName(r),
    amount: Number(r.amount || 0),
    ts: (r.ts ? new Date(r.ts).toISOString() : null)
  }));

  // rev = a monotonic timestamp the client can compare to avoid stale writes
  const rev = Date.now();

  return { donors, rev };
}

/**
 * Admin helper: update donor fields by pledge id (uuid).
 * Useful for manual fixes via /api/admin/fix-donor.
 */
export async function updateDonor({ id, name, is_anonymous }) {
  const sql = getSql();
  if (!id) throw new Error("Missing id");

  await sql`
    update pledges
    set
      name = ${typeof name === "string" ? name : null},
      is_anonymous = ${typeof is_anonymous === "boolean" ? is_anonymous : null}
    where id = ${id}::uuid
  `;

  return { ok: true };
}
