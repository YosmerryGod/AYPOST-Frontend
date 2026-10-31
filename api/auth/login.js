import { createToken } from "../../lib/api-auth.js";
import { sendJson, methodNotAllowed } from "../../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const configuredPin = process.env.AYPOST_ADMIN_PIN;
  if (!configuredPin || !process.env.AYPOST_JWT_SECRET) {
    return sendJson(res, 503, { error: "AYPOST_ADMIN_PIN dan AYPOST_JWT_SECRET belum dikonfigurasi." });
  }
  const pin = String(req.body?.pin || "");
  if (!pin || pin.length > 64 || pin !== configuredPin) {
    return sendJson(res, 401, { error: "PIN tidak sesuai." });
  }
  try {
    const token = createToken({ sub: "owner", role: "owner", name: "Administrator" });
    return sendJson(res, 200, { token, user: { name: "Administrator", role: "owner" }, expiresIn: 43200 });
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
}