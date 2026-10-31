import { getDb, sendJson, methodNotAllowed } from "../lib/db.js";
import { requireAuth } from "../lib/api-auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const user = requireAuth(req, res);
  if (!user) return;
  try {
    const sql = getDb();
    const rows = await sql`SELECT COALESCE(SUM(total), 0) AS sales_today, COUNT(*)::int AS orders_today, COALESCE(AVG(total), 0) AS average_order FROM orders WHERE payment_status = 'paid' AND created_at >= date_trunc('day', NOW())`;
    const bestSellers = await sql`SELECT product_name, SUM(quantity)::int AS quantity_sold, SUM(line_total) AS revenue FROM order_items i JOIN orders o ON o.id = i.order_id WHERE o.payment_status = 'paid' AND o.created_at >= date_trunc('day', NOW()) GROUP BY product_name ORDER BY quantity_sold DESC LIMIT 5`;
    return sendJson(res, 200, { data: { ...rows[0], best_sellers: bestSellers } });
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
}