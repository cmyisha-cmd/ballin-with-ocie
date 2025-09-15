import { useState } from 'react'

export default function Tickets() {
  const [form, setForm] = useState({ name:'', count:1 })
  const submit = async (e) => {
    e.preventDefault()
    await fetch('/api/tickets', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name: form.name, count: Number(form.count||1) })
    })
    alert('Thank you! Your tickets will be available at the Box Office.')
    setForm({ name:'', count:1 })
  }
  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-4">Get Tickets</h2>
      <form onSubmit={submit} className="card space-y-4">
        <input className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Your Name"
               value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Ticket Count" type="number" min="1"
               value={form.count} onChange={e=>setForm({...form, count:e.target.value})} required />
        <button className="btn w-full" type="submit">Request Tickets</button>
      </form>
    </section>
  )
}
