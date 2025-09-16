import { useState } from 'react'
import { api } from '../lib/api'

export default function Register(){
  const [form, setForm] = useState({name:'', age:'', shooting:false, team:false})
  const [msg, setMsg] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    setMsg('')
    try{
      await api.register({...form, age: Number(form.age||0)})
      setMsg('Registered!')
      setForm({name:'', age:'', shooting:false, team:false})
    }catch(err){
      setMsg(err.message || 'Error')
    }
  }

  return (
    <section className="container-nba py-10">
      <h2 className="text-3xl font-black text-nbaPurple">Player Registration</h2>
      <form onSubmit={submit} className="card mt-4 grid gap-4 max-w-xl">
        <input className="bg-black border border-zinc-700 rounded-lg p-3" placeholder="Name"
          value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
        <input type="number" className="bg-black border border-zinc-700 rounded-lg p-3" placeholder="Age"
          value={form.age} onChange={e=>setForm(f=>({...f, age:e.target.value}))}/>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.shooting}
          onChange={e=>setForm(f=>({...f, shooting:e.target.checked}))}/> Shooting Contest</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.team}
          onChange={e=>setForm(f=>({...f, team:e.target.checked}))}/> Team Tournament</label>
        <button className="btn" type="submit">Submit</button>
        {msg && <div className="text-sm text-zinc-300">{msg}</div>}
      </form>
    </section>
  )
}
