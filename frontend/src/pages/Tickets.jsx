import { useState } from 'react'
import axios from 'axios'
const API = __API_BASE__ || ''

export default function Tickets(){
  const [form, setForm] = useState({ name:'', quantity:1 })
  const [msg, setMsg] = useState('')

  const onChange = e => setForm(f => ({...f, [e.target.name]: e.target.value}))

  async function submit(e){
    e.preventDefault()
    const res = await axios.post(`${API}/api/tickets`, form)
    setMsg(res.data?.message || 'Thank you! Your tickets will be available at the Box Office.')
    setForm({ name:'', quantity:1 })
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="h2 mb-4">Get Tickets</h2>
      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="label">Your Name</label>
          <input className="input w-full" name="name" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label className="label">Non-player Tickets</label>
          <input className="input w-full" name="quantity" type="number" min="1" value={form.quantity} onChange={onChange} required />
        </div>
        <button className="btn w-full">Request Tickets</button>
      </form>
      {msg && <div className="mt-3 text-green-400">{msg}</div>}
    </div>
  )
}
