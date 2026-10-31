const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("aypost_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}/api${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Permintaan ke server gagal.");
  return payload;
}

export async function loginWithPin(pin) {
  const result = await apiRequest("/auth/login", { method: "POST", body: JSON.stringify({ pin }) });
  localStorage.setItem("aypost_token", result.token);
  return result.user;
}

export function logout() {
  localStorage.removeItem("aypost_token");
}

export async function getProducts() {
  return apiRequest("/products");
}

export async function getCategories() {
  return apiRequest("/categories");
}

export async function createOrder(order) {
  return apiRequest("/orders", { method: "POST", body: JSON.stringify(order) });
}

export async function getDashboard() {
  return apiRequest("/dashboard");
}