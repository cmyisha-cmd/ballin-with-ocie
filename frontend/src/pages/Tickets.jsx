
import { useState } from 'react'
const API = '/api'

export default function Tickets(){
  const [name, setName] = useState('')
  const [qty, setQty] = useState(1)
  const [msg, setMsg] = useState(null)

  async function submit(e){
    e.preventDefault()
    setMsg(null)
    const res = await fetch(`${API}/tickets`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name: name.trim(), quantity: Number(qty) })
    })
    const j = await res.json().catch(()=>({message:'Error'}))
    if(res.ok){ setMsg(j.message || 'Request received!'); setName(''); setQty(1) }
    else setMsg(j.message || 'Error')
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="h2 mb-6">Get Tickets</h2>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <div>
          <label className="label">Your Name</label>
          <input className="field w-full" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Quantity</label>
          <input type="number" min="1" className="field w-full" value={qty} onChange={e=>setQty(e.target.value)} />
        </div>
        <button className="btn w-full">Request Tickets</button>
        {msg && <div className="text-center text-sm text-white/80">{msg}</div>}
      </form>
    </div>
  )
}
