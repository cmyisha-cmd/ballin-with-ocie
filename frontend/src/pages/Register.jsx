import React, { useState } from 'react'
import { api } from '../lib/api'

export default function Register(){
  const [form, setForm] = useState({name:'', age:'', shooting:true, team:true})
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e){
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      await api('/register', {method:'POST', body: JSON.stringify({
        name: form.name.trim(), age: Number(form.age||0), shooting: !!form.shooting, team: !!form.team
      })})
      setMsg('Registered! See you at the court.')
      setForm({name:'', age:'', shooting:true, team:true})
    } catch(err){
      setMsg(err.message || 'Failed to register')
    } finally { setBusy(false) }
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-12">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Register as a Player</h2>
        {msg && <div className="mb-4 text-sm text-nbaAccent">{msg}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label>Name</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required placeholder="Player full name" />
          </div>
          <div>
            <label>Age</label>
            <input type="number" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} required min="5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.shooting} onChange={e=>setForm({...form, shooting:e.target.checked})} />
              Shooting Contest
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.team} onChange={e=>setForm({...form, team:e.target.checked})} />
              Team Tournament
            </label>
          </div>
          <button className="btn w-full" disabled={busy}>{busy ? 'Submitting…' : 'Submit Registration'}</button>
        </form>
      </div>
    </section>
  )
}
