// pages/api/admin/diag.js
import { getSql } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ ok:false, reason:"DATABASE_URL missing" });
    }
    const sql = getSql();

    // Does pledges table exist?
    const tables = await sql`select to_regclass('public.pledges') as t`;
    const tableExists = !!tables?.[0]?.t;

    let columns = [];
    if (tableExists) {
      columns = await sql`
        select column_name, data_type
        from information_schema.columns
        where table_schema='public' and table_name='pledges'
        order by ordinal_position
      `;
    }

    return res.status(200).json({
      ok: true,
      db: "connected",
      tableExists,
      columns
    });
  } catch (e) {
    return res.status(200).json({ ok:false, error: String(e && e.message || e) });
  }
}
