import React, { useState, useEffect } from 'react'

export default function Tickets(){
  const [form, setForm] = useState({ name:'', quantity:1 })
  const [msg, setMsg] = useState('')
  const [total, setTotal] = useState(0)

  async function load(){
    try{
      const res = await fetch('/api/tickets'); const t = await res.json()
      const sum = (t||[]).reduce((a,b)=> a + Number(b.quantity||0), 0)
      setTotal(sum)
    }catch(e){}
  }
  useEffect(()=>{ load() }, [])

  async function submit(e){
    e.preventDefault()
    setMsg('')
    const res = await fetch('/api/tickets', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
    const data = await res.json()
    if(res.ok){ setMsg('Thank you! Your tickets will be available at the Box Office.'); setForm({name:'', quantity:1}); load() }
    else setMsg('❌ '+(data.message||'Failed'))
  }

  return (
    <section className="card" style={{margin:'28px 0'}}>
      <h2 style={{marginTop:0}}>Request Spectator Tickets</h2>
      <p className="muted">Total requested so far: <strong>{total}</strong></p>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <label>Number of tickets</label>
        <input type="number" min="1" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})} />
        <div className="cta">
          <button className="btn" type="submit">Request Tickets</button>
        </div>
      </form>
      {msg && <p className="muted" style={{marginTop:10}}>{msg}</p>}
    </section>
  )
}
