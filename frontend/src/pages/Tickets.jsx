import { useState } from 'react'
import { postJSON } from '../api'

export default function Tickets(){
  const [name,setName]=useState('')
  const [count,setCount]=useState(1)
  const [msg,setMsg]=useState('')

  async function submit(e){
    e.preventDefault()
    const res = await postJSON('/tickets',{ name, count: Number(count) })
    setMsg('Thank you! Your tickets will be available at the Box Office.')
    setName(''); setCount(1)
  }

  return (
    <div className="container" style={{padding:'2rem 1rem'}}>
      <h2>Get Tickets</h2>
      <form onSubmit={submit} className="card grid" style={{maxWidth:560, margin:'0 auto'}}>
        <input className="input" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="input" placeholder="Number of non-player tickets" type="number" min="1" value={count} onChange={e=>setCount(e.target.value)} required />
        <button className="btn" type="submit">Request Tickets</button>
        {msg && <div className="tag">{msg}</div>}
      </form>
    </div>
  )
}
