const API_BASE = import.meta.env.VITE_API_BASE || '';

async function j(method, url, body, headers={}){
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: { 'Content-Type':'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined
  });
  if(!res.ok){
    let msg = 'Request failed';
    try{ const t = await res.json(); msg = t.message || JSON.stringify(t) }catch{}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  register: (p) => j('POST','/api/register', p),
  getShooting: () => j('GET','/api/shooting'),
  setScore: (id, payload) => j('PATCH', `/api/shooting/${id}`, payload),
  getTeams: () => j('GET','/api/teams'),
  autoTeams: (pass) => j('POST','/api/teams/auto', {}, {'x-admin-pass': pass}),
  getTickets: () => j('GET','/api/tickets'),
  addTickets: (p) => j('POST','/api/tickets', p),
  getMessages: () => j('GET','/api/messages'),
  addMessage: (p) => j('POST','/api/messages', p),
  reactMessage: (id, emoji) => j('POST', `/api/messages/${id}/react`, {emoji}),
  deleteMessage: (id, pass) => j('DELETE', `/api/messages/${id}`, undefined, {'x-admin-pass': pass}),
  resetAll: (pass) => j('POST','/api/reset', {}, {'x-admin-pass': pass}),
  health: () => j('GET','/api/health')
}
