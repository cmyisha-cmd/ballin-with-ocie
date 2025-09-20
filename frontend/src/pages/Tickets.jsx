import React, { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com'

export default function Tickets(){
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    try{
      const r = await fetch(`${API_URL}/api/tickets`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, quantity }) })
      const data = await r.json()
      setMsg(data.message || 'Tickets requested')
      setName(''); setQuantity(1)
    }catch{ setMsg('Error requesting tickets') }
  }

  return (
    <section className="card" style={{margin:'28px 0'}}>
      <h2>Get Non- Player Tickets</h2>
      <form onSubmit={submit} className="grid" style={{gap:12}}>
        <input placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} required/>
        <input type="number" min="1" placeholder="Quantity" value={quantity} onChange={e=>setQuantity(Number(e.target.value)||1)} required/>
        <div className="cta"><button className="btn" type="submit">Request Tickets</button></div>
      </form>
      {msg && <p style={{marginTop:10}}>{msg}</p>}
    </section>
  )
}
