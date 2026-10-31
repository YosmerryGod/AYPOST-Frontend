import crypto from "node:crypto";
import { sendJson } from "./db.js";

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function createToken(payload) {
  const secret = process.env.AYPOST_JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("AYPOST_JWT_SECRET harus berisi minimal 32 karakter.");
  const header = encode({ alg: "HS256", typ: "JWT" });
  const body = encode({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 });
  const unsigned = header + "." + body;
  const signature = crypto.createHmac("sha256", secret).update(unsigned).digest("base64url");
  return unsigned + "." + signature;
}

export function requireAuth(req, res) {
  const secret = process.env.AYPOST_JWT_SECRET;
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!secret || !token) {
    sendJson(res, 401, { error: "Silakan login terlebih dahulu." });
    return null;
  }
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token");
    const unsigned = parts[0] + "." + parts[1];
    const expected = crypto.createHmac("sha256", secret).update(unsigned).digest();
    const actual = Buffer.from(parts[2], "base64url");
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) throw new Error("Invalid signature");
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Expired token");
    return payload;
  } catch {
    sendJson(res, 401, { error: "Sesi login tidak valid atau sudah berakhir." });
    return null;
  }
}