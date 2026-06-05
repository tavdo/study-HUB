/** Empty = same origin (Railway single service or CRA proxy in dev). */
export const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
