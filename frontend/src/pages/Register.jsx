import { useState } from 'react'

export default function Register() {
  const [form, setForm] = useState({ name:'', age:'', events:[] })
  const toggleEvent = (eName) => {
    setForm(f => ({
      ...f,
      events: f.events.includes(eName) ? f.events.filter(x=>x!==eName) : [...f.events, eName]
    }))
  }
  const submit = async (e) => {
    e.preventDefault()
    // Register for each selected event as individual entries
    for (const ev of form.events) {
      await fetch('/api/players', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name: form.name, age: Number(form.age||0), event: ev })
      })
    }
    alert('Registration submitted!')
    setForm({ name:'', age:'', events:[] })
  }
  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-4">Register as a Player</h2>
      <form onSubmit={submit} className="card space-y-4">
        <input className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Full Name"
               value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="w-full p-3 rounded bg-neutral-900 border border-neutral-800" placeholder="Age" type="number"
               value={form.age} onChange={e=>setForm({...form, age:e.target.value})} required />
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.events.includes('Shooting Contest')}
                  onChange={()=>toggleEvent('Shooting Contest')} /> Shooting Contest</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.events.includes('Team Tournament')}
                  onChange={()=>toggleEvent('Team Tournament')} /> Team Tournament</label>
        </div>
        <button className="btn w-full" type="submit">Submit Registration</button>
      </form>
    </section>
  )
}
