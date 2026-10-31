import { getDb, sendJson, methodNotAllowed } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const sql = getDb();
    const rows = await sql`SELECT NOW() AS database_time`;
    return sendJson(res, 200, { status: "ok", app: "AYPOST", database: "connected", databaseTime: rows[0].database_time });
  } catch (error) {
    return sendJson(res, 503, { status: "error", database: "disconnected", error: error.message });
  }
}