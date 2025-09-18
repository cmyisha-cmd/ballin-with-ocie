import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Admin(){
  const [pass, setPass] = useState('');
  const [ok, setOk] = useState(false);

  const [players, setPlayers] = useState([]);
  const [shooting, setShooting] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [teams, setTeams] = useState({A:[], B:[]});

  async function loadAll(){
    try{
      const [p,s,t,tm] = await Promise.all([
        fetch(`${API_URL}/api/players`).then(r=>r.json()),
        fetch(`${API_URL}/api/shooting`).then(r=>r.json()).catch(()=>[]),
        fetch(`${API_URL}/api/tickets`).then(r=>r.json()),
        fetch(`${API_URL}/api/teams`).then(r=>r.json()).catch(()=>({A:[],B:[]}))
      ]);
      setPlayers(p||[]); 
      setShooting(s||[]); 
      setTickets(t||[]); 
      setTeams(tm||{A:[],B:[]});
    }catch(err){
      console.error("Admin loadAll error:", err);
    }
  }

  useEffect(()=>{ 
    if(ok){ 
      loadAll(); 
      const i=setInterval(loadAll, 8000); 
      return ()=>clearInterval(i); 
    } 
  }, [ok]);

  async function saveScore(id, score, time){
    try {
      await fetch(`${API_URL}/api/shooting/${id}`, { 
        method:'PATCH', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify({score:Number(score||0), time}) 
      });
      loadAll();
    } catch (err) {
      console.error("Save score error:", err);
    }
  }

  async function autoTeams(){
    try {
      await fetch(`${API_URL}/api/teams/auto`, { 
        method:'POST', 
        headers:{ 'x-admin-pass': 'ocie2025' } 
      });
      loadAll();
    } catch (err) {
      console.error("AutoTeams error:", err);
    }
  }

  async function resetData(){
    if(!confirm('This will clear all data. Continue?')) return;
    try {
      await fetch(`${API_URL}/api/reset`, { 
        method:'POST', 
        headers:{ 'x-admin-pass': 'ocie2025' } 
      });
      loadAll();
    } catch (err) {
      console.error("Reset error:", err);
    }
  }

  if(!ok){
    return (
      <section className="card" style={{margin:'28px 0'}}>
        <h2>Admin Login</h2>
        <form onSubmit={(e)=>{ 
          e.preventDefault(); 
          if(pass==='ocie2025') setOk(true); 
          else alert('Wrong password'); 
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
      <div className="card">
        <h3 style={{marginTop:0}}>Shooting Contest</h3>
        <table>
          <thead><tr><th>Player</th><th>Score</th><th>Time (mm:ss)</th><th></th></tr></thead>
          <tbody>
            {shooting.map(p=>{
              const [mm,ss] = String(p.time||'00:00').split(':');
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><input type="number" defaultValue={p.score||0} id={`s-${p.id}`} /></td>
                  <td>
                    <div style={{display:'flex', gap:6}}>
                      <input style={{width:70}} defaultValue={mm||'00'} id={`m-${p.id}`} placeholder="mm" />
                      <input style={{width:70}} defaultValue={ss||'00'} id={`x-${p.id}`} placeholder="ss" />
                    </div>
                  </td>
                  <td>
                    <button className="btn" onClick={()=>{
                      const s = document.getElementById(`s-${p.id}`).value;
                      const m = document.getElementById(`m-${p.id}`).value.padStart(2,'0');
                      const x = document.getElementById(`x-${p.id}`).value.padStart(2,'0');
                      saveScore(p.id, s, `${m}:${x}`);
                    }}>Save</button>
                  </td>
                </tr>
              )
            })}
            {shooting.length===0 && <tr><td colSpan="4" className="muted">No shooting entries yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Teams</h3>
        <div className="cta"><button className="btn" onClick={autoTeams}>Auto-Assign Teams</button></div>
        <div className="grid" style={{marginTop:10}}>
          <div><h4>Team A</h4><ul>{teams.A.map(t=><li key={t.id}>{t.name}</li>)}</ul></div>
          <div><h4>Team B</h4><ul>{teams.B.map(t=><li key={t.id}>{t.name}</li>)}</ul></div>
        </div>
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Tickets</h3>
        <p className="muted">Total requested: <strong>{(tickets||[]).reduce((a,b)=>a+Number(b.quantity||0),0)}</strong></p>
        <ul>{tickets.map(t=><li key={t.id}>{t.name} — {t.quantity}</li>)}</ul>
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Danger Zone</h3>
        <button className="btn danger" onClick={resetData}>Remove Test Data</button>
      </div>
    </section>
  )
}
