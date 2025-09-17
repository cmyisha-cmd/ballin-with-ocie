
import { useState } from 'react'

const API = '/api'

export default function Register(){
  const [form, setForm] = useState({name:'', age:'', shooting:false, team:false})
  const [status, setStatus] = useState(null)

  async function submit(e){
    e.preventDefault()
    setStatus(null)
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ 
        name: form.name.trim(), 
        age: Number(form.age||0), 
        shooting: !!form.shooting, 
        team: !!form.team 
      })
    })
    if(res.ok){
      setStatus('Registered! See you on the court.')
      setForm({name:'', age:'', shooting:false, team:false})
    } else {
      const j = await res.json().catch(()=>({message:'Error'}))
      setStatus(j.message || 'Error')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="h2 mb-6">Player Registration</h2>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <div>
          <label className="label">Name</label>
          <input className="field w-full" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        </div>
        <div>
          <label className="label">Age</label>
          <input type="number" min="0" className="field w-full" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} />
        </div>
        <div className="flex items-center gap-3">
          <input id="shoot" type="checkbox" checked={form.shooting} onChange={e=>setForm({...form, shooting:e.target.checked})} />
          <label htmlFor="shoot">Shooting Contest</label>
        </div>
        <div className="flex items-center gap-3">
          <input id="team" type="checkbox" checked={form.team} onChange={e=>setForm({...form, team:e.target.checked})} />
          <label htmlFor="team">Team Tournament</label>
        </div>
        <button className="btn w-full">Submit</button>
        {status && <div className="text-center text-sm text-white/80">{status}</div>}
      </form>
    </div>
  )
}
