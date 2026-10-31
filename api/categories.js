import { getDb, sendJson, methodNotAllowed } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const sql = getDb();
    const rows = await sql`SELECT id, name, sort_order FROM categories WHERE is_active = TRUE ORDER BY sort_order, name`;
    return sendJson(res, 200, { data: rows });
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
}