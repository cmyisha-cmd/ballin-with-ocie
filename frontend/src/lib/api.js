const base = import.meta.env.VITE_API_BASE?.replace(/\/$/,'') || '/api'

export async function api(path, opts={}){
  const res = await fetch(`${base}${path}`, {
    headers: {'Content-Type':'application/json', ...(opts.headers||{})},
    ...opts
  })
  if(!res.ok){
    const t = await res.text().catch(()=>'');
    throw new Error(t || res.statusText)
  }
  const ct = res.headers.get('content-type')||''
  return ct.includes('application/json') ? res.json() : res.text()
}
