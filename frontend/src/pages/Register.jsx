import React, { useState } from 'react'

export default function Register(){
  const [form, setForm] = useState({ name:'', age:'', shooting:false, team:false })
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    setMsg('')
    const res = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
    const data = await res.json()
    if(res.ok){ setMsg('✅ Registered!'); setForm({ name:'', age:'', shooting:false, team:false }) }
    else setMsg('❌ '+(data.message||'Failed'))
  }

  return (
    <section className="card" style={{margin:'28px 0'}}>
      <h2 style={{marginTop:0}}>Register as a Player</h2>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <label>Age</label>
        <input type="number" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} />
        <div className="grid">
          <label><input type="checkbox" checked={form.shooting} onChange={e=>setForm({...form, shooting:e.target.checked})} /> Shooting Contest</label>
          <label><input type="checkbox" checked={form.team} onChange={e=>setForm({...form, team:e.target.checked})} /> Team Tournament</label>
        </div>
        <div className="cta">
          <button className="btn" type="submit">Submit Registration</button>
        </div>
      </form>
      {msg && <p className="muted" style={{marginTop:10}}>{msg}</p>}
    </section>
  )
}
