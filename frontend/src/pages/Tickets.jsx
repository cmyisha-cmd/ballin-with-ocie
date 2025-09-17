import React, { useState } from 'react'
import { api } from '../lib/api'

export default function Tickets(){
  const [form, setForm] = useState({name:'', quantity:1})
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e){
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      const res = await api('/tickets', {method:'POST', body: JSON.stringify({
        name: form.name.trim(), quantity: Number(form.quantity||1)
      })})
      setMsg(res.message || 'Thank you! Your tickets will be available at the Box Office.')
      setForm({name:'', quantity:1})
    } catch(err){
      setMsg(err.message || 'Failed to request tickets')
    } finally { setBusy(false) }
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-12">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Get Tickets</h2>
        {msg && <div className="mb-4 text-sm text-nbaAccent">{msg}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label>Name</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required placeholder="Your full name" />
          </div>
          <div>
            <label>Number of non-player tickets</label>
            <input type="number" min="1" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})} />
          </div>
          <button className="btn w-full" disabled={busy}>{busy ? 'Submitting…' : 'Request Tickets'}</button>
        </form>
      </div>
    </section>
  )
}
