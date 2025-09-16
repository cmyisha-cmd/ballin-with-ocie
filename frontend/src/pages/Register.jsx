import React, { useState } from 'react'
import api from '../lib/api'

export default function Register(){
  const [form, setForm] = useState({ name:'', age:'', shooting:false, team:false })
  const [msg, setMsg] = useState('')
  const submit = async (e)=>{
    e.preventDefault()
    setMsg('')
    const res = await api.post('/api/register', {...form, age: Number(form.age||0)})
    setMsg(res.data.message || 'Registered!')
    setForm({ name:'', age:'', shooting:false, team:false })
  }
  return (
    <section className="max-w-xl mx-auto px-4 py-10">
      <h3 className="text-2xl font-bold text-purple-400 mb-4">Register as a Player</h3>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        <input className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2" placeholder="Age" type="number" value={form.age} onChange={e=>setForm({...form, age:e.target.value})}/>
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input type="checkbox" checked={form.shooting} onChange={e=>setForm({...form, shooting:e.target.checked})}/>
          Shooting Contest
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input type="checkbox" checked={form.team} onChange={e=>setForm({...form, team:e.target.checked})}/>
          Team Tournament
        </label>
        <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded font-semibold">Register</button>
      </form>
      {msg && <p className="mt-4 text-green-400">{msg}</p>}
    </section>
  )
}
