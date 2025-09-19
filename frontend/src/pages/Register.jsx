import React, { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com'

export default function Register(){
  const [form, setForm] = useState({ name:'', age:'', shooting:false, team:false })
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    try{
      const r = await fetch(`${API_URL}/api/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      const data = await r.json()
      setMsg(data.message || 'Registered!')
      setForm({ name:'', age:'', shooting:false, team:false })
    }catch{ setMsg('Error registering') }
  }

  return (
    <section className="card" style={{margin:'28px 0'}}>
      <h2>Register to Play</h2>
      <form onSubmit={submit} className="grid" style={{gap:12}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        <input placeholder="Age" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} required/>
        <label><input type="checkbox" checked={form.shooting} onChange={e=>setForm({...form, shooting:e.target.checked})}/> Shooting Contest</label>
        <label><input type="checkbox" checked={form.team} onChange={e=>setForm({...form, team:e.target.checked})}/> Team Tournament</label>
        <div className="cta"><button className="btn" type="submit">Register</button></div>
      </form>
      {msg && <p style={{marginTop:10}}>{msg}</p>}
    </section>
  )
}
