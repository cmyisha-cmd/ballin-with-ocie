const API_BASE = import.meta.env.VITE_API_BASE || '';
// If served by the same server (Render single-service), API is under /api
export function api(path, opts={}){
  return fetch(`${API_BASE}/api${path}`, {headers:{'Content-Type':'application/json', ...(opts.headers||{})}, ...opts});
}
export async function getJSON(path){ const r = await api(path); return r.json(); }
export async function postJSON(path, body){ const r = await api(path,{method:'POST', body: JSON.stringify(body)}); return r.json(); }
export async function del(path, headers){ const r = await api(path,{method:'DELETE', headers}); return r.json(); }
