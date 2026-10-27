const BASE = '/api/v1';
const TOKEN_KEY = 'fj_admin_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export async function api(path, { method = 'GET', body, auth = false, raw } = {}) {
  const headers = {};
  if (!raw) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: raw ? body : body ? JSON.stringify(body) : undefined,
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(payload?.error?.message || `Request failed (${res.status})`);
    error.details = payload?.error?.details;
    error.status = res.status;
    throw error;
  }
  return payload.data;
}

export const getSite = () => api('/site');
