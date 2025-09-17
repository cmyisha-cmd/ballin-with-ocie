import { useState } from 'react'
import { api } from '../lib/api'

export default function Tickets(){
  const [name,setName] = useState('')
  const [qty,setQty] = useState(1)
  const [msg,setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    setMsg('')
    const res = await api('/tickets',{method:'POST', body:JSON.stringify({name, quantity: qty})})
    setName(''); setQty(1);
    setMsg(res.message || '✅ Thank you! Your tickets will be available at the Box Office.')
  }

  return (
    <div className="card max-w-xl mx-auto">
      <h2 className="text-primary mb-4">Get Spectator Tickets</h2>
      <form onSubmit={submit} className="space-y-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" required className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
        <input value={qty} onChange={e=>setQty(e.target.value)} type="number" min="1" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
        <button className="btn w-full">Request Tickets</button>
      </form>
      {msg && <p className="mt-4 text-green-400">{msg}</p>}
    </div>
  )
}
