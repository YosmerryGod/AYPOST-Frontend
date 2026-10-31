import { getDb, sendJson, methodNotAllowed } from "../lib/db.js";
import { requireAuth } from "../lib/api-auth.js";

const paymentMethods = ["cash", "qris", "transfer", "card"];

export default async function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;
  const sql = getDb();

  if (req.method === "GET") {
    try {
      const limit = Math.min(Math.max(Number(req.query?.limit) || 50, 1), 100);
      const rows = await sql`SELECT o.id, o.order_number, o.order_type, o.table_number, o.payment_method, o.payment_status, o.subtotal, o.discount, o.total, o.created_at, COALESCE(json_agg(json_build_object('product_name', i.product_name, 'unit_price', i.unit_price, 'quantity', i.quantity, 'line_total', i.line_total)) FILTER (WHERE i.id IS NOT NULL), '[]') AS items FROM orders o LEFT JOIN order_items i ON i.order_id = o.id GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${limit}`;
      return sendJson(res, 200, { data: rows });
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];
    const paymentMethod = String(body.payment_method || "cash");
    const subtotal = Number(body.subtotal);
    const discount = Number(body.discount || 0);
    const total = Number(body.total);
    const cashReceived = Number(body.cash_received || 0);
    if (!items.length || items.length > 100 || !paymentMethods.includes(paymentMethod) ||
      !Number.isFinite(subtotal) || !Number.isFinite(discount) || !Number.isFinite(total) ||
      subtotal < 0 || discount < 0 || total < 0 || total !== Math.max(0, subtotal - discount)) {
      return sendJson(res, 400, { error: "Data transaksi tidak valid." });
    }
    for (const item of items) {
      if (!String(item.name || "").trim() || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1 ||
        !Number.isFinite(Number(item.price)) || Number(item.price) < 0) {
        return sendJson(res, 400, { error: "Item transaksi tidak valid." });
      }
    }
    if (paymentMethod === "cash" && cashReceived < total) {
      return sendJson(res, 400, { error: "Uang diterima kurang dari total pembayaran." });
    }
    try {
      const orderNumber = "AY-" + Date.now().toString(36).toUpperCase();
      const itemPayload = items.map((item) => ({
        product_id: Number.isInteger(Number(item.id)) ? Number(item.id) : null,
        product_name: String(item.name).trim(),
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
        line_total: Number(item.price) * Number(item.quantity)
      }));
      const rows = await sql`
        WITH created AS (
          INSERT INTO orders (order_number, order_type, table_number, payment_method, payment_status, subtotal, discount, total, cash_received, change_amount)
          VALUES (
            ${orderNumber},
            ${body.order_type === "dine_in" ? "dine_in" : "takeaway"},
            ${body.order_type === "dine_in" ? String(body.table_number || "") : null},
            ${paymentMethod}, 'paid', ${subtotal}, ${discount}, ${total}, ${cashReceived}, ${Math.max(0, cashReceived - total)}
          )
          RETURNING id, order_number, total, created_at
        ),
        inserted_items AS (
          INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
          SELECT created.id, item.product_id, item.product_name, item.unit_price, item.quantity, item.line_total
          FROM created
          CROSS JOIN jsonb_to_recordset(${JSON.stringify(itemPayload)}::jsonb) AS item(product_id BIGINT, product_name TEXT, unit_price NUMERIC, quantity INTEGER, line_total NUMERIC)
          RETURNING id
        )
        SELECT created.id, created.order_number, created.total, created.created_at FROM created
      `;
      return sendJson(res, 201, { data: rows[0] });
    } catch (error) {
      return sendJson(res, 500, { error: error.message });
    }
  }
  return methodNotAllowed(res, ["GET", "POST"]);
}