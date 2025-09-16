import { useState } from 'react'
import axios from 'axios'
const API = __API_BASE__ || ''

export default function Register(){
  const [form, setForm] = useState({ name:'', age:'', shooting:false, team:false })
  const [msg, setMsg] = useState('')

  const onChange = e => {
    const {name, value, type, checked} = e.target
    setForm(f => ({...f, [name]: type === 'checkbox' ? checked : value}))
  }

  async function submit(e){
    e.preventDefault()
    const res = await axios.post(`${API}/api/register`, form)
    setMsg(res.data?.message || 'Registered!')
    setForm({ name:'', age:'', shooting:false, team:false })
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="h2 mb-4">Register as a Player</h2>
      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input className="input w-full" name="name" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label className="label">Age</label>
          <input className="input w-full" name="age" type="number" value={form.age} onChange={onChange} required />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="shooting" checked={form.shooting} onChange={onChange}/>
            Shooting Contest
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="team" checked={form.team} onChange={onChange}/>
            Team Tournament
          </label>
        </div>
        <button className="btn w-full" type="submit">Submit Registration</button>
      </form>
      {msg && <div className="mt-3 text-green-400">{msg}</div>}
    </div>
  )
}
