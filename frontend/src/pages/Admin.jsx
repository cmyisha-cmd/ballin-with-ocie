import { useEffect, useMemo, useState } from 'react'
import { api, setAdmin } from '../lib/api'

export default function Admin(){
  const [pass,setPass] = useState('')
  const hdr = useMemo(()=> setAdmin(pass), [pass])
  const [players,setPlayers] = useState([])
  const [shooting,setShooting] = useState([])
  const [tickets,setTickets] = useState([])
  const [teams,setTeams] = useState({A:[],B:[]})

  async function load(){
    setPlayers(await api('/players'))
    setShooting(await api('/shooting'))
    setTickets(await api('/tickets'))
    setTeams(await api('/teams'))
  }
  useEffect(()=>{ load(); const t=setInterval(load,4000); return ()=>clearInterval(t)},[])

  async function saveScore(id, score, time){
    await api(`/shooting/${id}`, {method:'PATCH', body:JSON.stringify({score:Number(score||0), time})})
    load()
  }

  async function autoTeams(){
    await api('/teams/auto', {method:'POST', headers: hdr})
    load()
  }

  async function reset(){
    await api('/reset', {method:'POST', headers: hdr})
    load()
  }

  const ticketTotal = tickets.reduce((a,b)=> a + Number(b.quantity||0), 0)

  return (
    <div className="space-y-6">
      <div className="card flex items-center justify-between">
        <h2 className="text-primary">Admin Dashboard</h2>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin password" className="px-3 py-2 rounded bg-white/5 border border-white/10" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-white mb-2">Shooting Contest (enter scores and time MM:SS)</h3>
          <table className="w-full text-left">
            <thead className="text-white/70"><tr><th className="py-2">Player</th><th>Score</th><th>Time</th><th></th></tr></thead>
            <tbody>
              {shooting.map(p=>{
                const tId = `t-${p.id}`; const sId = `s-${p.id}`
                return (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="py-2">{p.name}</td>
                    <td><input id={sId} defaultValue={p.score||0} className="w-20 px-2 py-1 rounded bg-white/5 border border-white/10" /></td>
                    <td><input id={tId} defaultValue={p.time||'00:00'} placeholder="MM:SS" className="w-24 px-2 py-1 rounded bg-white/5 border border-white/10" /></td>
                    <td><button className="btn" onClick={()=>{
                      const score = document.getElementById(sId).value
                      const time = document.getElementById(tId).value
                      saveScore(p.id, score, time)
                    }}>Save</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white">Teams</h3>
            <button className="btn" onClick={autoTeams}>Auto-Assign Teams</button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <div className="font-bold text-primary mb-1">Team A</div>
              <ul className="space-y-1">{teams.A.map(m=><li key={m.id}>• {m.name}</li>)}</ul>
            </div>
            <div>
              <div className="font-bold text-primary mb-1">Team B</div>
              <ul className="space-y-1">{teams.B.map(m=><li key={m.id}>• {m.name}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-white">Spectator Tickets</h3>
          <div className="text-white/80">Total Requested: <span className="font-bold">{ticketTotal}</span></div>
          <ul className="mt-2 space-y-1">
            {tickets.map(t=> <li key={t.id}>• {t.name} — {t.quantity}</li>)}
          </ul>
        </div>

        <div className="card">
          <h3 className="font-bold text-white mb-2">Players</h3>
          <ul className="space-y-1">
            {players.map(p=> <li key={p.id}>• {p.name} ({p.age || 'N/A'}) {p.shooting? '— Shooting':''} {p.team? '— Team':''}</li>)}
          </ul>
          <button className="btn mt-4 bg-red-600/80" onClick={reset}>Reset All Data</button>
        </div>
      </div>
    </div>
  )
}
