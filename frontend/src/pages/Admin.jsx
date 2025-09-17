import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

export default function Admin(){
  const [admin, setAdmin] = useState('')
  const [players, setPlayers] = useState([])
  const [shooting, setShooting] = useState([])
  const [tickets, setTickets] = useState([])
  const [teams, setTeams] = useState({A:[], B:[]})
  const totalTickets = useMemo(()=> tickets.reduce((a,t)=>a+Number(t.quantity||0),0), [tickets])

  async function load(){
    const [p, s, t, tm] = await Promise.all([
      api('/players'), api('/shooting'), api('/tickets'), api('/teams')
    ])
    setPlayers(p); setShooting(s); setTickets(t); setTeams(tm)
  }
  useEffect(()=>{ load() }, [])

  async function saveScore(id, score, time){
    await api(`/shooting/${id}`, {method:'PATCH', body: JSON.stringify({score: Number(score||0), time})})
    await load()
  }
  async function autoTeams(){
    await api('/teams/auto', {method:'POST', headers:{'x-admin-pass': admin}})
    await load()
  }
  async function reset(){
    await api('/reset', {method:'POST', headers:{'x-admin-pass': admin}})
    await load()
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div><label>Admin Password</label><input type="password" value={admin} onChange={e=>setAdmin(e.target.value)} placeholder="••••••" /></div>
          <button className="btn" onClick={autoTeams}>Auto-Assign Teams</button>
          <button className="btn bg-red-600 hover:bg-red-500" onClick={reset}>Reset (clear data)</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-bold mb-3">Shooting Contest</h3>
          <table>
            <thead><tr><th>Player</th><th>Score</th><th>Time (mm:ss)</th><th></th></tr></thead>
            <tbody>
              {shooting.map(p=>{
                let scoreRef, timeRef
                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td><input defaultValue={p.score||0} ref={el=>scoreRef=el} className="w-20"/></td>
                    <td><input defaultValue={p.time||'00:00'} ref={el=>timeRef=el} className="w-24"/></td>
                    <td><button className="btn" onClick={()=>saveScore(p.id, scoreRef.value, timeRef.value)}>Save</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-3">Teams</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-nbaAccent mb-2">Team A</h4>
              <ul className="space-y-1">{teams.A.map(m=><li key={m.id}>• {m.name}</li>)}</ul>
            </div>
            <div>
              <h4 className="font-semibold text-nbaAccent mb-2">Team B</h4>
              <ul className="space-y-1">{teams.B.map(m=><li key={m.id}>• {m.name}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-bold mb-3">Players</h3>
          <ul className="space-y-1">{players.map(p=><li key={p.id}>• {p.name} ({p.age}) {p.shooting?'· Shooting':''} {p.team?'· Team':''}</li>)}</ul>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-3">Tickets</h3>
          <p className="mb-2 text-zinc-300">Total Requested: <span className="font-bold text-white">{totalTickets}</span></p>
          <ul className="space-y-1">{tickets.map(t=><li key={t.id}>• {t.name} — {t.quantity}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
