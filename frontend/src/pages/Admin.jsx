
import { useEffect, useState } from 'react'
const API = '/api'
const PASS = 'ocie2025'

export default function Admin(){
  const [shooting, setShooting] = useState([])
  const [tickets, setTickets] = useState([])
  const [teams, setTeams] = useState({A:[], B:[]})
  const [players, setPlayers] = useState([])

  async function load(){
    const [s,t,tm,pl] = await Promise.all([
      fetch(`${API}/shooting`).then(r=>r.json()),
      fetch(`${API}/tickets`).then(r=>r.json()),
      fetch(`${API}/teams`).then(r=>r.json()),
      fetch(`${API}/players`).then(r=>r.json())
    ])
    setShooting(s); setTickets(t); setTeams(tm); setPlayers(pl)
  }
  useEffect(()=>{ load() }, [])

  async function updateScore(id, score, time){
    await fetch(`${API}/shooting/${id}`, {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ score:Number(score||0), time })
    })
    load()
  }

  async function autoTeams(){
    await fetch(`${API}/teams/auto`, { method:'POST', headers:{'x-admin-pass': PASS} })
    load()
  }

  async function reset(){
    if(!confirm('Reset all data?')) return
    await fetch(`${API}/reset`, { method:'POST', headers:{'x-admin-pass': PASS} })
    load()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="h2">Admin Dashboard</h2>
        <div className="flex gap-2">
          <button className="btn" onClick={autoTeams}>Auto Assign Teams</button>
          <button className="btn" onClick={reset}>Reset (Clear Data)</button>
        </div>
      </div>

      <section className="card p-6">
        <h3 className="font-bold mb-4">Shooting Contest</h3>
        <div className="text-sm text-white/60 mb-2">Update score and time (MM:SS). Highest score, then lowest time wins.</div>
        <div className="grid md:grid-cols-2 gap-3">
          {shooting.map(p => (
            <div key={p.id} className="bg-black/30 rounded-xl p-4 border border-white/10">
              <div className="font-semibold">{p.name}</div>
              <div className="mt-2 flex gap-2">
                <input className="field" type="number" min="0" placeholder="Score" defaultValue={p.score||0} id={`s-${p.id}`} />
                <input className="field" type="text" placeholder="MM:SS" defaultValue={p.time||'00:00'} id={`t-${p.id}`} />
                <button className="btn" onClick={()=>{
                  const s = document.getElementById(`s-${p.id}`).value
                  const t = document.getElementById(`t-${p.id}`).value
                  updateScore(p.id, s, t)
                }}>Save</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h3 className="font-bold mb-4">Team Tournament</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="font-semibold mb-2">Team A</div>
            <ul className="space-y-1">{teams.A?.map(m=><li key={m.id} className="text-sm">{m.name}</li>)}</ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Team B</div>
            <ul className="space-y-1">{teams.B?.map(m=><li key={m.id} className="text-sm">{m.name}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h3 className="font-bold mb-4">Tickets</h3>
        <div className="text-sm text-white/70 mb-2">Total requested: {tickets.reduce((a,b)=>a + Number(b.quantity||0), 0)}</div>
        <ul className="space-y-1">{tickets.map(t=><li key={t.id} className="text-sm">{t.name} — {t.quantity}</li>)}</ul>
      </section>

      <section className="card p-6">
        <h3 className="font-bold mb-4">Registered Players</h3>
        <ul className="space-y-1">{players.map(p=><li key={p.id} className="text-sm">{p.name} · age {p.age||'-'} · {p.shooting?'Shooting':''} {p.team?'Team':''}</li>)}</ul>
      </section>
    </div>
  )
}
