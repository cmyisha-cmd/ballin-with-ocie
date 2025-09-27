import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com'

export default function Admin(){
  const [pass, setPass] = useState('')
  const [ok, setOk] = useState(false)

  const [players, setPlayers] = useState([])
  const [shooting, setShooting] = useState([])
  const [tickets, setTickets] = useState([])
  const [teams, setTeams] = useState({})
  const [bracket, setBracket] = useState(null)

  async function loadAll(){
    try{
      const [p,s,t,tm] = await Promise.all([
        fetch(`${API_URL}/api/players`).then(r=>r.json()),
        fetch(`${API_URL}/api/shooting`).then(r=>r.json()),
        fetch(`${API_URL}/api/tickets`).then(r=>r.json()),
        fetch(`${API_URL}/api/teams`).then(r=>r.json())
      ])
      setPlayers(p||[]); setShooting(s||[]); setTickets(t||[]); setTeams(tm||{});
    }catch(e){ console.error(e) }
  }

  async function loadBracket(){
    try{
      const res = await fetch(`${API_URL}/api/bracket`);
      const data = await res.json();
      setBracket(data);
    }catch(e){ console.error(e); }
  }

  useEffect(()=>{
    if(ok){ 
      loadAll(); 
      loadBracket();
      const i=setInterval(()=>{ loadAll(); loadBracket(); }, 8000); 
      return ()=>clearInterval(i) 
    } 
  }, [ok])

  async function autoTeams(){
    await fetch(`${API_URL}/api/teams/auto`, { 
      method:'POST', 
      headers:{ 'x-admin-pass': 'ocie2025' } 
    })
    loadAll()
  }

  async function resetData(){
    if(!confirm('This will clear all data. Continue?')) return
    await fetch(`${API_URL}/api/reset`, { 
      method:'POST', 
      headers:{ 'x-admin-pass': 'ocie2025' } 
    })
    loadAll()
  }

  if(!ok){
    return (
      <section className="card" style={{margin:'28px 0'}}>
        <h2>Admin Login</h2>
        <form onSubmit={(e)=>{ 
          e.preventDefault(); 
          if(pass==='ocie2025') setOk(true); 
          else alert('Wrong password') 
        }}>
          <input 
            type="password" 
            placeholder="Password" 
            value={pass} 
            onChange={e=>setPass(e.target.value)} 
          />
          <div className="cta"><button className="btn">Login</button></div>
        </form>
      </section>
    )
  }

  return (
    <section className="grid" style={{margin:'28px 0'}}>
      
      {/* Teams */}
      <div className="card">
        <h3 style={{marginTop:0}}>Teams</h3>
        <div className="cta">
          <button className="btn" onClick={autoTeams}>Auto-Assign Teams</button>
          <Link to="/bracket" className="btn">View Bracket</Link>
        </div>
        <div className="grid" style={{marginTop:10}}>
          {Object.keys(teams).map(key => (
            <div key={key}>
              <h4>Team {key}</h4>
              <ul>
                {teams[key].map(t=>(
                  <li key={t.id}>{t.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tickets */}
      <div className="card">
        <h3 style={{marginTop:0}}>Tickets</h3>
        <p className="muted">
          Total requested: <strong>{(tickets||[]).reduce((a,b)=>a+Number(b.quantity||0),0)}</strong>
        </p>
        <ul>{tickets.map(t=>(
          <li key={t.id}>{t.name} — {t.quantity}</li>
        ))}</ul>
      </div>

      {/* Bracket Management */}
      <div className="card">
        <h3 style={{marginTop:0}}>Bracket Management</h3>
        <div className="cta" style={{display:'flex', gap:8, marginBottom:10}}>
          <button className="btn" onClick={async()=>{
            await fetch(`${API_URL}/api/bracket/generate`, { 
              method:'POST', 
              headers:{'x-admin-pass':'ocie2025'} 
            });
            loadBracket();
          }}>Generate Bracket</button>
          <button className="btn" onClick={loadBracket}>Refresh Bracket</button>
        </div>
        {bracket && (bracket.semi || bracket.final) ? (
          <pre>{JSON.stringify(bracket,null,2)}</pre>
        ) : (
          <p className="muted">No bracket yet. Use Auto-Assign Teams, then Generate Bracket.</p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="card">
        <h3 style={{marginTop:0}}>Danger Zone</h3>
        <button className="btn danger" onClick={resetData}>Remove Test Data</button>
      </div>
    </section>
  )
}
