import React, { useState, useEffect } from 'react'
import api from '../lib/api'

export default function Tickets(){
  const [form, setForm] = useState({ name:'', quantity:1 })
  const [msg, setMsg] = useState('')
  const [rows, setRows] = useState([])

  const load = async ()=>{
    const res = await api.get('/api/tickets'); setRows(res.data || [])
  }
  useEffect(()=>{ load() }, [])

  const submit = async (e)=>{
    e.preventDefault()
    setMsg('')
    const res = await api.post('/api/tickets', {...form, quantity:Number(form.quantity||1)})
    setMsg(res.data.message || 'Submitted!')
    setForm({ name:'', quantity:1 })
    load()
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h3 className="text-2xl font-bold text-purple-400 mb-4">Get Tickets</h3>
      <form onSubmit={submit} className="space-y-4 mb-8">
        <input className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2" placeholder="Your Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        <input className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})} required/>
        <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded font-semibold">Request</button>
      </form>
      {msg && <p className="mb-6 text-green-400">{msg}</p>}
      <div className="bg-neutral-900/60 border border-neutral-700 rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-neutral-200">Requests</h4>
          <span className="text-sm text-neutral-400">Total Tickets: {rows.reduce((s,r)=>s+Number(r.quantity||0),0)}</span>
        </div>
        <ul className="space-y-2">
          {rows.map(r=>(
            <li key={r.id} className="text-sm text-neutral-300">{r.name} • {r.quantity}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
