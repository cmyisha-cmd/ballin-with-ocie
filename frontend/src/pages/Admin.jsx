import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Admin(){
  const [pass, setPass] = useState('')
  const [authed, setAuthed] = useState(false)
  const [shooting, setShooting] = useState([])
  const [teams, setTeams] = useState({A:[], B:[]})
  const [tickets, setTickets] = useState([])

  const load = async ()=>{
    const s = await api.get('/api/shooting'); setShooting(s.data||[])
    const t = await api.get('/api/teams'); setTeams(t.data||{A:[],B:[]})
    const tk = await api.get('/api/tickets'); setTickets(tk.data||[])
  }
  useEffect(()=>{ if(authed) load() }, [authed])

  const saveScore = async (id, score, time)=>{
    await api.patch(`/api/shooting/${id}`, { score:Number(score||0), time })
    load()
  }
  const autoTeams = async ()=>{
    await api.post('/api/teams/auto', {}, { headers:{'x-admin-pass':pass} })
    load()
  }
  const resetAll = async ()=>{
    await api.post('/api/reset', {}, { headers:{'x-admin-pass':pass} })
    load()
  }

  if(!authed){
    return (
      <section className="max-w-md mx-auto px-4 py-10">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">Admin Login</h3>
        <form onSubmit={(e)=>{e.preventDefault(); setAuthed(true)}} className="space-y-3">
          <input type="password" className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} />
          <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded font-semibold">Enter</button>
        </form>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-purple-400">Admin Dashboard</h3>
        <div className="flex gap-2">
          <button onClick={autoTeams} className="bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded text-sm">Auto-Assign Teams</button>
          <button onClick={resetAll} className="bg-red-700 hover:bg-red-600 px-3 py-2 rounded text-sm">Reset All Data</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-neutral-900/60 border border-neutral-700 rounded p-4">
          <h4 className="font-semibold mb-2 text-neutral-200">Shooting Contest</h4>
          <p className="text-xs text-neutral-400 mb-3">Update score and time (mm:ss). Leaderboard reorders automatically.</p>
          <ul className="space-y-2">
            {shooting.map(p=>(
              <li key={p.id} className="text-sm flex items-center gap-2">
                <span className="w-40">{p.name}</span>
                <input placeholder="Score" className="w-20 bg-neutral-800 border border-neutral-700 rounded px-2 py-1" defaultValue={p.score} onBlur={e=>saveScore(p.id, e.target.value, p.time)} />
                <input placeholder="mm:ss" className="w-24 bg-neutral-800 border border-neutral-700 rounded px-2 py-1" defaultValue={p.time} onBlur={e=>saveScore(p.id, p.score, e.target.value)} />
              </li>
            ))}
            {shooting.length===0 && <li className="text-neutral-400 text-sm">No shooting contestants yet.</li>}
          </ul>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-700 rounded p-4">
          <h4 className="font-semibold mb-2 text-neutral-200">Teams</h4>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-purple-300 mb-1 font-semibold">Team A</div>
              <ul className="space-y-1">{teams.A?.map(t=><li key={t.id}>{t.name}</li>)}</ul>
            </div>
            <div>
              <div className="text-purple-300 mb-1 font-semibold">Team B</div>
              <ul className="space-y-1">{teams.B?.map(t=><li key={t.id}>{t.name}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900/60 border border-neutral-700 rounded p-4">
        <h4 className="font-semibold mb-2 text-neutral-200">Tickets</h4>
        <div className="text-sm text-neutral-300">
          Total Tickets: {tickets.reduce((s,r)=>s+Number(r.quantity||0),0)}
        </div>
        <ul className="mt-2 space-y-1 text-sm">
          {tickets.map(t=>(<li key={t.id}>{t.name} • {t.quantity}</li>))}
          {tickets.length===0 && <li className="text-neutral-400 text-sm">No ticket requests yet.</li>}
        </ul>
      </div>
    </section>
  )
}
