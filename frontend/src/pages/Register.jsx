import { useState } from 'react'
import { postJSON } from '../api'

export default function Register(){
  const [name,setName]=useState('')
  const [age,setAge]=useState('')
  const [shooting,setShooting]=useState(true)
  const [team,setTeam]=useState(true)
  const [msg,setMsg]=useState('')

  async function submit(e){
    e.preventDefault()
    const res = await postJSON('//register-player',{ name, age: Number(age), shooting, team })
    setMsg(res?.message || 'Registered!')
    setName(''); setAge(''); setShooting(false); setTeam(false)
  }

  return (
    <div className="container" style={{padding:'2rem 1rem'}}>
      <h2>Register as a Player</h2>
      <form onSubmit={submit} className="card grid" style={{maxWidth:560, margin:'0 auto'}}>
        <input className="input" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="input" placeholder="Age" type="number" value={age} onChange={e=>setAge(e.target.value)} required />
        <label className="flex"><input type="checkbox" checked={shooting} onChange={e=>setShooting(e.target.checked)}/> <span>Shooting Contest</span></label>
        <label className="flex"><input type="checkbox" checked={team} onChange={e=>setTeam(e.target.checked)}/> <span>Team Tournament</span></label>
        <button className="btn" type="submit">Submit</button>
        {msg && <div className="tag">{msg}</div>}
      </form>
    </div>
  )
}
