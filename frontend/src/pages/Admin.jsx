import { useEffect, useState } from 'react'
const ADMIN_PASS = 'ocie2025'

export default function Admin(){
  const [logged, setLogged] = useState(false)
  const [pass, setPass] = useState('')
  const [shooting, setShooting] = useState([])
  const [teams, setTeams] = useState({A:[],B:[]})
  const [tickets, setTickets] = useState([])

  function tryLogin(){ if(pass===ADMIN_PASS){ setLogged(true); loadAll() } }

  async function loadAll(){
    setShooting(await (await fetch('/api/shooting')).json())
    setTeams(await (await fetch('/api/teams')).json())
    setTickets(await (await fetch('/api/tickets')).json())
  }
  async function saveScore(id, score, time){
    await fetch(`/api/shooting/${id}`,{method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({score:Number(score||0), time})})
    loadAll()
  }
  async function autoTeams(){
    await fetch('/api/teams/auto',{method:'POST', headers:{'x-admin-pass': ADMIN_PASS}})
    loadAll()
  }
  async function reset(){
    await fetch('/api/reset',{method:'POST', headers:{'x-admin-pass': ADMIN_PASS}})
    loadAll()
  }

  if(!logged) return (
    <div className="card max-w-md mx-auto">
      <h3 className="text-xl font-bold text-purple-400 mb-3">Admin Login</h3>
      <div className="flex gap-2">
        <input type="password" className="p-2 rounded text-black w-full" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)}/>
        <button onClick={tryLogin} className="btn">Login</button>
      </div>
    </div>
  )

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-purple-300">Shooting Contest Scores</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left p-2">Player</th><th className="p-2">Score</th><th className="p-2">Time (mm:ss)</th><th className="p-2"></th></tr></thead>
            <tbody>
              {shooting.map(p=>{
                let scoreInput = 0, timeInput = '00:00'
                return (
                  <tr key={p.id} className="border-t border-zinc-800/60">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2"><input defaultValue={p.score||0} onChange={e=>scoreInput=e.target.value} className="p-1 rounded text-black w-20 text-center"/></td>
                    <td className="p-2"><input defaultValue={p.time||'00:00'} onChange={e=>timeInput=e.target.value} className="p-1 rounded text-black w-24 text-center" placeholder="mm:ss"/></td>
                    <td className="p-2"><button className="btn" onClick={()=>saveScore(p.id, scoreInput, timeInput)}>Save</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-purple-300">Teams</h4>
          <button className="btn" onClick={autoTeams}>Auto-Assign Teams</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><h5 className="font-bold text-purple-400 mb-2">Team A</h5><ul className="space-y-1">{teams.A?.map(t=>(<li key={t.id}>• {t.name}</li>))}</ul></div>
          <div><h5 className="font-bold text-purple-400 mb-2">Team B</h5><ul className="space-y-1">{teams.B?.map(t=>(<li key={t.id}>• {t.name}</li>))}</ul></div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-purple-300">Tickets</h4>
          <div className="text-sm text-zinc-300">Total: <b>{tickets.reduce((a,b)=>a+(b.quantity||0),0)}</b></div>
        </div>
        <ul className="space-y-1 text-sm">{tickets.map(t=>(<li key={t.id} className="flex justify-between"><span>{t.name}</span><span>x{t.quantity}</span></li>))}</ul>
      </div>

      <div className="card">
        <h4 className="font-semibold text-purple-300 mb-2">Danger Zone</h4>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg" onClick={reset}>Reset All Data</button>
      </div>
    </div>
  )
}
