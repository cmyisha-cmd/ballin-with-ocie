import { useEffect, useState } from 'react'

const ADMIN_PASSWORD = 'admin123'

export default function Admin() {
  const [pw, setPw] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('scores')
  const [players, setPlayers] = useState([])
  const [tickets, setTickets] = useState([])
  const [teams, setTeams] = useState([])
  const [inputs, setInputs] = useState({}) // {id:{score,time}}

  const fetchAll = async () => {
    const [p, t, tm] = await Promise.all([
      fetch('/api/players').then(r=>r.json()),
      fetch('/api/tickets').then(r=>r.json()),
      fetch('/api/teams').then(r=>r.json())
    ])
    setPlayers(p); setTickets(t); setTeams(tm)
  }

  useEffect(()=>{
    if (!authed) return
    fetchAll()
    const h = setInterval(fetchAll, 10000)
    return ()=>clearInterval(h)
  }, [authed])

  const saveScore = async (id) => {
    const d = inputs[id]
    if (!d) return
    await fetch('/api/scores', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ playerId:id, score:Number(d.score||0), time:Number(d.time||0) })
    })
    await fetchAll()
  }

  const autoAssign = async () => {
    await fetch('/api/teams/auto-assign', { method:'POST' })
    await fetchAll()
  }

  if (!authed) {
    return (
      <section className="min-h-[60vh] grid place-items-center px-4">
        <form onSubmit={(e)=>{e.preventDefault(); setAuthed(pw===ADMIN_PASSWORD) }} className="card w-full max-w-sm space-y-3">
          <h2 className="text-2xl font-bold text-primary">Admin Login</h2>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
                 placeholder="Password" className="w-full p-3 rounded bg-neutral-900 border border-neutral-800"/>
          <button className="btn w-full" type="submit">Enter</button>
        </form>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-primary mb-4">Admin Dashboard</h2>
      <div className="flex gap-2 mb-6">
        {['scores','teams','tickets'].map(k => (
          <button key={k} onClick={()=>setTab(k)} className={`px-4 py-2 rounded ${tab===k?'bg-primary text-white':'bg-neutral-800'}`}>{k.toUpperCase()}</button>
        ))}
      </div>

      {tab==='scores' && (
        <div className="overflow-x-auto card">
          <table className="w-full text-left">
            <thead className="text-neutral-400">
              <tr>
                <th className="py-2">Player</th>
                <th className="py-2">Event</th>
                <th className="py-2">Score</th>
                <th className="py-2">Time (s)</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {players.map(p => (
                <tr key={p.id} className="border-t border-neutral-800">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.event}</td>
                  <td className="py-2">
                    <input type="number" className="w-24 p-2 rounded bg-neutral-900 border border-neutral-800"
                      placeholder={String(p.score||0)} onChange={e=>setInputs(i=>({...i,[p.id]:{...i[p.id],score:e.target.value}}))}/>
                  </td>
                  <td className="py-2">
                    <input type="number" className="w-24 p-2 rounded bg-neutral-900 border border-neutral-800"
                      placeholder={String(p.time||0)} onChange={e=>setInputs(i=>({...i,[p.id]:{...i[p.id],time:e.target.value}}))}/>
                  </td>
                  <td className="py-2"><button className="btn" onClick={()=>saveScore(p.id)}>Save</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='teams' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Teams</h3>
            <button className="btn" onClick={autoAssign}>Auto-Assign Teams</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {teams.map(t => (
              <div key={t.id} className="card">
                <div className="font-bold text-primary mb-2">{t.name}</div>
                <ul className="text-sm text-neutral-300 list-disc pl-5">
                  {t.players.map(pid => {
                    const p = players.find(px=>px.id===pid)
                    return <li key={pid}>{p ? p.name : `Player #${pid}`}</li>
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="card">
            <h4 className="text-lg font-semibold text-primary mb-2">Bracket (Simple)</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="card">Round 1<br/>{teams[0]?.name || 'TBD'} vs {teams[1]?.name || 'TBD'}</div>
              <div className="card">Final<br/>{teams[0]?.name || 'TBD'} vs {teams[1]?.name || 'TBD'}</div>
              <div className="card">Round 1<br/>{teams[2]?.name || 'TBD'} vs {teams[3]?.name || 'TBD'}</div>
            </div>
          </div>
        </div>
      )}

      {tab==='tickets' && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-3">Spectator Tickets</h3>
          <ul className="space-y-2">
            {tickets.map(t => (
              <li key={t.id} className="flex justify-between">
                <span>{t.name}</span><span className="text-primary">{t.count}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">
              {tickets.reduce((s,t)=>s+Number(t.count||0),0)}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
