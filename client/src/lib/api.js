/**
 * Where the API lives. Empty (the default) means same-origin: the Vite dev proxy in
 * development, or the single-service deploy where Express also serves the built SPA.
 * Set VITE_API_URL at build time to point a separately hosted front end at the API,
 * e.g. VITE_API_URL=https://portfolio-api.onrender.com
 */
export const API_ORIGIN = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

const BASE = `${API_ORIGIN}/api/v1`;
const TOKEN_KEY = 'fj_admin_token';

/** Uploads are stored as root-relative paths, so they need the API origin prepended. */
export const assetUrl = (url) => (url && url.startsWith('/') ? `${API_ORIGIN}${url}` : url);

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
