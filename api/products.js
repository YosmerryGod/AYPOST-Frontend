import { getDb, sendJson, methodNotAllowed } from "../lib/db.js";
import { requireAuth } from "../lib/api-auth.js";

export default async function handler(req, res) {
  const sql = getDb();
  if (req.method === "GET") {
    try {
      const rows = await sql`SELECT p.id, p.name, p.description, p.price, p.image_url, p.stock, p.is_available, p.category_id, c.name AS category FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.is_available = TRUE ORDER BY p.name`;
      return sendJson(res, 200, { data: rows });
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }
  if (req.method === "POST") {
    const user = requireAuth(req, res);
    if (!user) return;
    const { name, description = "", price, image_url = null, category_id = null, stock = null } = req.body || {};
    const numericPrice = Number(price);
    if (!String(name || "").trim() || !Number.isFinite(numericPrice) || numericPrice < 0) {
      return sendJson(res, 400, { error: "Nama produk dan harga yang valid wajib diisi." });
    }
    try {
      const rows = await sql`INSERT INTO products (name, description, price, image_url, category_id, stock) VALUES (${String(name).trim()}, ${String(description)}, ${numericPrice}, ${image_url}, ${category_id}, ${stock}) RETURNING id, name, description, price, image_url, category_id, stock, is_available`;
      return sendJson(res, 201, { data: rows[0] });
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }
  return methodNotAllowed(res, ["GET", "POST"]);
}