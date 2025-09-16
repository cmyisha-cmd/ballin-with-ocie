import { useEffect, useState } from 'react'
import { getJSON, postJSON } from '../api'

export default function Admin(){
  const [pass,setPass]=useState('')
  const [ok,setOk]=useState(false)
  const [players,setPlayers]=useState([])
  const [tickets,setTickets]=useState([])
  const [teams,setTeams]=useState([])
  const [messages,setMessages]=useState([])

  useEffect(()=>{ (async()=>{
    const [p,t,m] = await Promise.all([getJSON('/players'), getJSON('/tickets'), getJSON('/messages')])
    setPlayers(p||[]); setTickets(t||[]); setMessages(m||[])
  })() },[])

  async function login(){ if(pass==='ocie2025') setOk(true) }

  async function saveScore(p){
    const res = await postJSON('/shooting/update',{ id:p.id, score:Number(p.score||0), time:p.time||'' })
    setPlayers(res.players||players)
  }
  async function autoTeams(){
    const res = await postJSON('/teams/autoassign',{}, {'x-admin-pass':'ocie2025'})
    setTeams(res.teams||[])
  }
  async function resetData(){
    const res = await postJSON('/reset',{}, {'x-admin-pass':'ocie2025'})
    setPlayers(res.players); setTickets(res.tickets); setMessages(res.messages); setTeams(res.teams||[])
  }

  const totalTickets = tickets.reduce((a,b)=>a+(Number(b.count)||0),0)

  return (
    <div className="container" style={{padding:'2rem 1rem'}}>
      <h2>Admin Dashboard</h2>
      {!ok && (
        <div className="card row" style={{maxWidth:520}}>
          <input className="input col" type="password" placeholder="Enter admin password" value={pass} onChange={e=>setPass(e.target.value)} />
          <button className="btn" onClick={login}>Unlock</button>
        </div>
      )}

      <div className="grid" style={{gridTemplateColumns:'1fr', gap:'1rem'}}>
        <section className="card">
          <h3>Shooting Contest — Scores</h3>
          <div className="small">Players auto-added from registration.</div>
          <table className="table">
            <thead><tr><th>Name</th><th>Score</th><th>Time (MM:SS)</th><th></th></tr></thead>
            <tbody>
              {players.filter(p=>p.shooting).map(p=>(
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><input className="input" style={{maxWidth:90}} value={p.score??''} onChange={e=>setPlayers(pl=>pl.map(x=>x.id===p.id?{...x,score:e.target.value}:x))}/></td>
                  <td><input className="input" style={{maxWidth:110}} placeholder="mm:ss" value={p.time??''} onChange={e=>setPlayers(pl=>pl.map(x=>x.id===p.id?{...x,time:e.target.value}:x))}/></td>
                  <td><button className="btn" onClick={()=>saveScore(p)}>Save</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h3>Teams — Auto Assign</h3>
          <button className="btn" onClick={autoTeams}>Auto Assign Teams</button>
          <div className="row" style={{marginTop:'1rem'}}>
            {teams.map((team,i)=>(
              <div key={i} className="card" style={{minWidth:260}}>
                <b>{team.name}</b>
                <ul>{team.players.map(pl=>(<li key={pl.id}>{pl.name}</li>))}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Spectators — Tickets</h3>
          <div className="tag">Total requested: {totalTickets}</div>
          <table className="table">
            <thead><tr><th>Name</th><th>Tickets</th></tr></thead>
            <tbody>
              {tickets.map((t,i)=>(<tr key={i}><td>{t.name}</td><td>{t.count}</td></tr>))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h3>Utilities</h3>
          <button className="btn secondary" onClick={resetData}>Remove Test Data / Reset</button>
        </section>
      </div>
    </div>
  )
}
