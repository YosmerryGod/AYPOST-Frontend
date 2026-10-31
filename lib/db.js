import { neon } from "@neondatabase/serverless";

let client;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum dikonfigurasi di environment Vercel.");
  }
  if (!client) client = neon(process.env.DATABASE_URL);
  return client;
}

export function sendJson(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  return sendJson(res, 405, { error: "Method not allowed" });
}