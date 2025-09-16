import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Admin(){
  const [pass, setPass] = useState('')
  const [shooting, setShooting] = useState([])
  const [teams, setTeams] = useState({A:[], B:[]})
  const [tickets, setTickets] = useState([])

  const loadAll = async ()=>{
    const [s,t,tk] = await Promise.all([api.getShooting(), api.getTeams(), api.getTickets()])
    setShooting(s); setTeams(t); setTickets(tk)
  }
  useEffect(()=>{ loadAll() }, [])

  const saveScore = async (id, score, time)=>{
    await api.setScore(id, {score:Number(score||0), time})
    await loadAll()
  }

  const autoTeams = async ()=>{
    if(!pass) { alert('Enter admin password'); return; }
    await api.autoTeams(pass)
    await loadAll()
  }

  const totalTickets = tickets.reduce((s,x)=> s + Number(x.quantity||0), 0)

  return (
    <section className="container-nba py-10">
      <h2 className="text-3xl font-black text-nbaPurple">Admin Dashboard</h2>

      <div className="card mt-4 grid gap-3">
        <div className="flex items-center gap-2">
          <div className="font-bold">Admin Password:</div>
          <input type="password" className="bg-black border border-zinc-700 rounded-lg p-2"
            placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} />
          <button className="btn" onClick={autoTeams}>Auto-Assign Teams</button>
          <button className="btn" onClick={()=>api.resetAll(pass).then(loadAll)}>Reset All (Clear Data)</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="card">
          <div className="font-bold text-nbaPurple mb-2">Shooting Contest — Enter Scores</div>
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-400">
              <tr><th>Name</th><th>Score</th><th>mm:ss</th><th></th></tr>
            </thead>
            <tbody>
              {shooting.map(p => {
                return (
                <tr key={p.id} className="border-t border-zinc-800">
                  <td className="py-2">{p.name}</td>
                  <td><input type="number" defaultValue={p.score} className="bg-black border border-zinc-700 rounded p-1 w-20"/></td>
                  <td><input type="text" defaultValue={p.time} placeholder="mm:ss" className="bg-black border border-zinc-700 rounded p-1 w-20"/></td>
                  <td><button className="btn" onClick={(e)=>{
                    const row = e.target.closest('tr')
                    const score = row.querySelector('input[type=number]').value
                    const time = row.querySelector('input[type=text]').value
                    saveScore(p.id, score, time)
                  }}>Save</button></td>
                </tr>)
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="font-bold text-nbaPurple mb-2">Teams</div>
          <div className="grid grid-cols-2 gap-4">
            <div><div className="font-bold mb-1">Team A</div><ul className="text-sm text-zinc-300 space-y-1">{teams.A.map(x=><li key={x.id}>{x.name}</li>)}</ul></div>
            <div><div className="font-bold mb-1">Team B</div><ul className="text-sm text-zinc-300 space-y-1">{teams.B.map(x=><li key={x.id}>{x.name}</li>)}</ul></div>
          </div>
        </div>

        <div className="card md:col-span-2">
          <div className="font-bold text-nbaPurple mb-2">Tickets</div>
          <div className="text-sm text-zinc-300">Total requested: <span className="font-bold">{totalTickets}</span></div>
          <ul className="mt-2 text-sm text-zinc-300 space-y-1">
            {tickets.map(t => <li key={t.id}>{t.name} — {t.quantity}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
