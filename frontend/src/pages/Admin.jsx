import { useEffect, useState } from 'react'
import axios from 'axios'
const API = __API_BASE__ || ''
const PASS = 'ocie2025'

function mmssToSecs(s){ const [m='0',sec='0']=String(s).split(':'); return (+m)*60+(+sec) }
function secsToMMSS(sec){ const m=Math.floor(sec/60), s=sec%60; return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0') }

export default function Admin(){
  const [ok, setOk] = useState(false)
  const [shooters, setShooters] = useState([])
  const [tickets, setTickets] = useState([])
  const [teams, setTeams] = useState({A:[],B:[]})
  const [totalTix, setTotalTix] = useState(0)

  async function loadAll(){
    const s = await axios.get(`${API}/api/shooting`); setShooters(s.data||[])
    const t = await axios.get(`${API}/api/tickets`); setTickets(t.data||[]); setTotalTix((t.data||[]).reduce((a,b)=>a+Number(b.quantity||0),0))
    const tm = await axios.get(`${API}/api/teams`); setTeams(tm.data||{A:[],B:[]})
  }

  useEffect(()=>{ if(ok) loadAll() },[ok])

  async function saveScore(id, score, time){
    await axios.patch(`${API}/api/shooting/${id}`, { score:Number(score), time })
    loadAll()
  }

  async function autoAssign(){
    await axios.post(`${API}/api/teams/auto`, {}, { headers: {'x-admin-pass': PASS} })
    loadAll()
  }

  async function clearData(){
    await axios.post(`${API}/api/reset`, {}, { headers: {'x-admin-pass': PASS} })
    loadAll()
  }

  if(!ok){
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="h2 mb-4">Admin Login</h2>
        <button className="btn w-full" onClick={()=>{
          const p = prompt('Enter password')
          if(p===PASS) setOk(true)
          else alert('Wrong password')
        }}>Enter</button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <section className="card">
        <div className="flex items-center justify-between">
          <h3 className="h2">Shooting Contest — Input Scores</h3>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="table">
            <thead><tr><th>Player</th><th>Score</th><th>Time (mm:ss)</th><th></th></tr></thead>
            <tbody>
              {shooters.map(p=>{
                const [m,s]=String(p.time||'00:00').split(':')
                return (
                <tr key={p.id} className="border-t border-white/5">
                  <td>{p.name}</td>
                  <td><input defaultValue={p.score||0} type="number" min="0" className="input w-24" id={`score-${p.id}`}/></td>
                  <td className="flex items-center gap-2">
                    <input defaultValue={m||'00'} type="number" min="0" className="input w-20" id={`m-${p.id}`}/>
                    :
                    <input defaultValue={s||'00'} type="number" min="0" max="59" className="input w-20" id={`s-${p.id}`}/>
                  </td>
                  <td><button className="btn" onClick={()=>{
                    const score = document.getElementById(`score-${p.id}`).value
                    const mm = document.getElementById(`m-${p.id}`).value.padStart(2,'0')
                    const ss = document.getElementById(`s-${p.id}`).value.padStart(2,'0')
                    saveScore(p.id, score, `${mm}:${ss}`)
                  }}>Save</button></td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between">
          <h3 className="h2">Team Tournament — Manage Teams</h3>
          <button className="btn" onClick={autoAssign}>Auto-Assign Teams</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div><div className="font-bold mb-2">Team A</div>{teams.A.map(p=>(<div key={p.id} className="py-1">{p.name}</div>))}</div>
          <div><div className="font-bold mb-2">Team B</div>{teams.B.map(p=>(<div key={p.id} className="py-1">{p.name}</div>))}</div>
        </div>
      </section>

      <section className="card">
        <h3 className="h2">Tickets — Requests</h3>
        <div className="text-sm text-gray-400 mb-2">Total requested: {totalTix}</div>
        {tickets.map(t=>(<div key={t.id} className="border-t border-white/5 py-2">{t.name} — {t.quantity}</div>))}
      </section>

      <section className="card">
        <h3 className="h2">Utilities</h3>
        <button className="btn" onClick={clearData}>Remove Test Data</button>
      </section>
    </div>
  )
}
