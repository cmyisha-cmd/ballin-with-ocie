const BASE = import.meta.env.VITE_API_BASE || '/api';

export async function api(path, opts={}){
  const res = await fetch(`${BASE}${path}`, {
    headers: {'Content-Type':'application/json', ...(opts.headers||{})},
    ...opts
  });
  if(!res.ok) throw new Error(await res.text());
  return res.headers.get('content-type')?.includes('application/json') ? res.json() : res.text();
}
export const setAdmin = (pass) => ({ 'x-admin-pass': pass });
