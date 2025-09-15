const API = import.meta.env.VITE_API_BASE || 'https://ballin-with-ocie.onrender.com';
import { useState, useEffect } from 'react'

export default function Messages() {
  const [form, setForm] = useState({ name:'', message:'' })
  const [items, setItems] = useState([])
  const load = async () => {
    const res = await fetch(`${API}/api/messages`)
    setItems(await res.json())
  }
  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${API}/api/messages`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name: form.name, message: form.message })
    })
    setForm({ name:'', message:'' })
    await load()
  }
  useEffect(()=>{ load() }, [])
  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-4">Send a Birthday Wish</h2>
      <form onSubmit={submit} className="card space-y-4">
        <input className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Your Name"
               value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <textarea className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Your Message"
               value={form.message} onChange={e=>setForm({...form, message:e.target.value})} required />
        <button className="btn w-full" type="submit">Post Message</button>
      </form>
      <div className="mt-6 space-y-3">
        {items.map(m => (
          <div key={m.id} className="card">
            <strong className="text-primary">{m.name}</strong>
            <div className="text-neutral-200">{m.message}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
