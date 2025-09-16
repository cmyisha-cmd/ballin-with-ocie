import { useState } from 'react'

export default function Register(){
  const [form, setForm] = useState({ name:'', age:'', shooting:false, team:false })
  const [msg, setMsg] = useState('')
  async function submit(e){
    e.preventDefault()
    const r = await fetch('/api/register', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...form, age: Number(form.age||0) })
    })
    const j = await r.json()
    setMsg(j.message || 'Submitted')
    setForm({ name:'', age:'', shooting:false, team:false })
  }
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="text-xl font-bold text-purple-400 mb-3">Register as a Player</h3>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 rounded text-black" placeholder="Full Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          <input className="w-full p-2 rounded text-black" placeholder="Age" type="number" value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))}/>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.shooting} onChange={e=>setForm(f=>({...f,shooting:e.target.checked}))}/> Shooting Contest</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.team} onChange={e=>setForm(f=>({...f,team:e.target.checked}))}/> Team Tournament</label>
          <button className="btn">Register</button>
        </form>
        {msg && <p className="text-green-400 mt-3">{msg}</p>}
      </div>
      <div className="card">
        <h4 className="font-semibold mb-2 text-purple-300">Event Options</h4>
        <ul className="list-disc ml-6 text-sm text-zinc-300">
          <li>Shooting Contest: Highest score, fastest time wins (tie-breaker is least time, format mm:ss).</li>
          <li>Team Tournament: Admin auto-assigns balanced teams; NBA-style bracket display.</li>
        </ul>
      </div>
    </div>
  )
}
