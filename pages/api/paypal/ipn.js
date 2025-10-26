export const config = { api: { bodyParser: false } };

import getRawBody from "raw-body";
import { getSql } from "../../lib/db";

async function verifyIPN(raw) {
  const body = `cmd=_notify-validate&${raw.toString("utf8")}`;
  const resp = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const text = await resp.text();
  return text.trim() === "VERIFIED";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const raw = await getRawBody(req);
    const verified = await verifyIPN(raw);
    if (!verified) {
      console.warn("IPN not verified");
      return res.status(400).end();
    }

    const data = Object.fromEntries(new URLSearchParams(raw.toString("utf8")));

    // Only process Completed
    if (data.payment_status !== "Completed") return res.status(200).end();

    const customId = data.custom;                 // our pledge.id
    const amount = Number(data.mc_gross || 0);
    const txnId = data.txn_id;                    // unique PayPal transaction
    const payerEmail = data.payer_email || null;
    const first = data.first_name || "";
    const last  = data.last_name || "";
    const fullName = (first || last) ? `${first} ${last}`.trim() : null;

    // Optional: assemble address if PayPal sent it
    const addr = (data.address_street || data.address_city || data.address_state || data.address_zip || data.address_country)
      ? {
          line1: data.address_street || "",
          line2: "",
          city: data.address_city || "",
          state: data.address_state || "",
          postal: data.address_zip || "",
          country: data.address_country || "_
export const config = { api: { bodyParser: false } };

import getRawBody from "raw-body";
import { getSql } from "../../lib/db";

async function verifyIPN(raw) {
  const body = `cmd=_notify-validate&${raw.toString("utf8")}`;
  const resp = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const text = await resp.text();
  return text.trim() === "VERIFIED";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const raw = await getRawBody(req);
    const verified = await verifyIPN(raw);
    if (!verified) {
      console.warn("IPN not verified");
      return res.status(400).end();
    }

    const data = Object.fromEntries(new URLSearchParams(raw.toString("utf8")));

    // Only process Completed
    if (data.payment_status !== "Completed") return res.status(200).end();

    const customId = data.custom;                 // our pledge.id
    const amount = Number(data.mc_gross || 0);
    const txnId = data.txn_id;                    // unique PayPal transaction
    const payerEmail = data.payer_email || null;
    const first = data.first_name || "";
    const last  = data.last_name || "";
    const fullName = (first || last) ? `${first} ${last}`.trim() : null;

    // Optional: assemble address if PayPal sent it
    const addr = (data.address_street || data.address_city || data.address_state || data.address_zip || data.address_country)
      ? {
          line1: data.address_street || "",
          line2: "",
          city: data.address_city || "",
          state: data.address_state || "",
          postal: data.address_zip || "",
          country: data.address_country || "_
