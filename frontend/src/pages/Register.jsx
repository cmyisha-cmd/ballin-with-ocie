import React, { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com'

export default function Register(){
  const [form, setForm] = useState({ name:'', age:'', contest:'tournament' })
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    if(!form.name || !form.age) {
      setMsg('Name and age required')
      return
    }
    const res = await fetch(`${API_URL}/api/players`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    if(res.ok) {
      setMsg('✅ Registered successfully!')
      setForm({ name:'', age:'', contest:'tournament' })
    } else {
      setMsg('❌ Registration failed')
    }
  }

  return (
    <section className="form-page">
      <div className="card">
        <h2>🏀 Register to Play</h2>
        <form onSubmit={submit}>
          <label>Name</label>
          <input 
            value={form.name} 
            onChange={e=>setForm({...form, name:e.target.value})} 
            placeholder="Enter your name" 
            required 
          />
          <label>Age</label>
          <input 
            type="number" 
            value={form.age} 
            onChange={e=>setForm({...form, age:e.target.value})} 
            placeholder="Enter your age" 
            required 
          />
          <label>Contest</label>
          <select 
            value={form.contest} 
            onChange={e=>setForm({...form, contest:e.target.value})}
          >
            <option value="tournament">Team Tournament</option>
            <option value="shooting">Shooting Contest</option>
          </select>
          <div className="cta">
            <button className="btn" type="submit">Register</button>
          </div>
        </form>
        {msg && <p className="muted">{msg}</p>}
      </div>
    </section>
  )
}
