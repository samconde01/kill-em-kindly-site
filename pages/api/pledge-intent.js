import { getSql } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id, amount, tShirtSize, email, address, tier, noReward } = req.body || {};
    if (!id || !amount || !email) return res.status(400).json({ error: "Missing id/amount/email" });

    const sql = getSql();
    await sql`
      insert into pledges (id, amount, email, t_shirt_size, address, tier, no_reward, status)
      values (${id}::uuid, ${amount}, ${email}, ${tShirtSize || null}, ${address ? JSON.stringify(address) : null}::jsonb,
              ${tier || null}, ${!!noReward}, 'INTENT')
      on conflict (id) do update
        set amount = excluded.amount,
            email = excluded.email,
            t_shirt_size = excluded.t_shirt_size,
            address = excluded.address,
            tier = excluded.tier,
            no_reward = excluded.no_reward;
    `;

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("pledge-intent error", e);
    return res.status(500).json({ error: "pledge-intent failed" });
  }
}
