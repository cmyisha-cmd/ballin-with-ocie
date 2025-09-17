import { useState } from 'react'
import { api } from '../lib/api'

export default function Register(){
  const [name,setName] = useState('')
  const [age,setAge] = useState('')
  const [shooting,setShooting] = useState(false)
  const [team,setTeam] = useState(false)
  const [done,setDone] = useState('')

  async function submit(e){
    e.preventDefault()
    setDone('')
    await api('/register',{method:'POST', body:JSON.stringify({name,age,shooting,team})})
    setName(''); setAge(''); setShooting(false); setTeam(false);
    setDone('✅ Registered! You’re all set.')
  }

  return (
    <div className="card max-w-xl mx-auto">
      <h2 className="text-primary mb-4">Register as a Player</h2>
      <form onSubmit={submit} className="space-y-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" required className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
        <input value={age} onChange={e=>setAge(e.target.value)} placeholder="Age" type="number" min="5" className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={shooting} onChange={e=>setShooting(e.target.checked)} /> Shooting Contest</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={team} onChange={e=>setTeam(e.target.checked)} /> Team Tournament</label>
        <button className="btn w-full">Submit Registration</button>
      </form>
      {done && <p className="mt-4 text-green-400">{done}</p>}
    </div>
  )
}
