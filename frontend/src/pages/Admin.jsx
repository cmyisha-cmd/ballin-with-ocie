import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com';

export default function Admin(){
  const [pass, setPass] = useState('');
  const [ok, setOk] = useState(false);

  const [players, setPlayers] = useState([]);
  const [shooting, setShooting] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [teams, setTeams] = useState({});
  const [bracket, setBracket] = useState({ semi: [], final: [] });

  async function loadAll(){
    try{
      const [p,s,t,tm,br] = await Promise.all([
        fetch(`${API_URL}/api/players`).then(r=>r.json()),
        fetch(`${API_URL}/api/shooting`).then(r=>r.json()),
        fetch(`${API_URL}/api/tickets`).then(r=>r.json()),
        fetch(`${API_URL}/api/teams`).then(r=>r.json()),
        fetch(`${API_URL}/api/bracket`).then(r=>r.json())
      ]);
      setPlayers(p||[]); setShooting(s||[]); setTickets(t||[]); setTeams(tm||{}); setBracket(br||{semi:[],final:[]});
    }catch(e){ console.error(e) }
  }
  useEffect(()=>{ if(ok){ loadAll(); const i=setInterval(loadAll,8000); return ()=>clearInterval(i) } }, [ok]);

  async function saveScore(id, score, time){
    await fetch(`${API_URL}/api/shooting/${id}`,{
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ score:Number(score||0), time })
    });
    loadAll();
  }

  async function autoTeams(){
    await fetch(`${API_URL}/api/teams/auto`,{
      method:'POST',
      headers:{ 'x-admin-pass':'ocie2025' }
    });
    loadAll();
  }

  async function resetData(){
    if(!confirm('This will clear all data. Continue?')) return;
    await fetch(`${API_URL}/api/reset`,{
      method:'POST',
      headers:{ 'x-admin-pass':'ocie2025' }
    });
    loadAll();
  }

  async function generateBracket(){
    await fetch(`${API_URL}/api/bracket/generate`,{
      method:'POST',
      headers:{ 'x-admin-pass':'ocie2025' }
    });
    loadAll();
  }
  async function updateGame(id, score1, score2){
    await fetch(`${API_URL}/api/bracket/${id}`,{
      method:'PATCH',
      headers:{ 'Content-Type':'application/json','x-admin-pass':'ocie2025' },
      body: JSON.stringify({ score1:Number(score1||0), score2:Number(score2||0) })
    });
    loadAll();
  }

  if(!ok){
    return (
      <section className="card" style={{margin:'28px 0'}}>
        <h2>Admin Login</h2>
        <form onSubmit={e=>{
          e.preventDefault();
          if(pass==='ocie2025') setOk(true);
          else alert('Wrong password');
        }}>
          <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} />
          <div className="cta"><button className="btn">Login</button></div>
        </form>
      </section>
    )
  }

  return (
    <section className="grid" style={{margin:'28px 0'}}>
      {/* Shooting Contest */}
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
                    <div style={{display:'flex',gap:6}}>
                      <input style={{width:70}} defaultValue={mm||'00'} id={`m-${p.id}`} placeholder="mm" />
                      <input style={{width:70}} defaultValue={ss||'00'} id={`x-${p.id}`} placeholder="ss" />
                    </div>
                  </td>
                  <td>
                    <button className="btn" onClick={()=>{
                      const s=document.getElementById(`s-${p.id}`).value;
                      const m=document.getElementById(`m-${p.id}`).value.padStart(2,'0');
                      const x=document.getElementById(`x-${p.id}`).value.padStart(2,'0');
                      saveScore(p.id,s,`${m}:${x}`);
                    }}>Save</button>
                    <button className="btn danger" onClick={()=>{
                      fetch(`${API_URL}/api/shooting/${p.id}`,{
                        method:'DELETE',
                        headers:{'x-admin-pass':'ocie2025'}
                      }).then(loadAll)
                    }}>Delete</button>
                  </td>
                </tr>
              )
            })}
            {shooting.length===0 && <tr><td colSpan="4" className="muted">No shooting entries yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Teams */}
      <div className="card">
        <h3 style={{marginTop:0}}>Teams</h3>
        <div className="cta"><button className="btn" onClick={autoTeams}>Auto-Assign Teams</button></div>
        <div className="grid" style={{marginTop:10}}>
          {Object.keys(teams).map(g=>(
            <div key={g}>
              <h4>Team {g}</h4>
              <input type="text" id={`new-${g}`} placeholder="New member name" />
              <button className="btn" onClick={()=>{
                const n=document.getElementById(`new-${g}`).value;
                if(!n) return;
                fetch(`${API_URL}/api/teams/${g}`,{
                  method:'POST',
                  headers:{'Content-Type':'application/json','x-admin-pass':'ocie2025'},
                  body: JSON.stringify({name:n})
                }).then(loadAll)
              }}>Add to Team {g}</button>
              <ul>
                {teams[g].map(t=>(
                  <li key={t.id}>
                    {t.name}
                    <button className="btn danger small" onClick={()=>{
                      fetch(`${API_URL}/api/teams/${g}/${t.id}`,{
                        method:'DELETE',
                        headers:{'x-admin-pass':'ocie2025'}
                      }).then(loadAll)
                    }}>x</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tickets */}
      <div className="card">
        <h3 style={{marginTop:0}}>Tickets</h3>
        <p className="muted">Total requested: <strong>{(tickets||[]).reduce((a,b)=>a+Number(b.quantity||0),0)}</strong></p>
        <ul>
          {tickets.map(t=>(
            <li key={t.id}>
              {t.name} —
              <input type="number" defaultValue={t.quantity} style={{width:60}} id={`tick-${t.id}`} />
              <button className="btn" onClick={()=>{
                const q=document.getElementById(`tick-${t.id}`).value;
                fetch(`${API_URL}/api/tickets/${t.id}`,{
                  method:'PATCH',
                  headers:{'Content-Type':'application/json','x-admin-pass':'ocie2025'},
                  body: JSON.stringify({quantity:q})
                }).then(loadAll)
              }}>Update</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bracket Management */}
      <div className="card">
        <h3 style={{marginTop:0}}>Bracket Management</h3>
        <div className="cta">
          <button className="btn" onClick={generateBracket}>Generate Bracket</button>
          <button className="btn" onClick={loadAll}>Refresh Bracket</button>
        </div>
        {['semi','final'].map(r=>(
          <div key={r}>
            <h4>{r.toUpperCase()}</h4>
            <ul>
              {bracket[r]?.map(g=>(
                <li key={g.id}>
                  {g.team1} vs {g.team2} — 
                  <input type="number" defaultValue={g.score1} id={`g-${g.id}-s1`} style={{width:50}} /> : 
                  <input type="number" defaultValue={g.score2} id={`g-${g.id}-s2`} style={{width:50}} />
                  <button className="btn" onClick={()=>{
                    const s1=document.getElementById(`g-${g.id}-s1`).value;
                    const s2=document.getElementById(`g-${g.id}-s2`).value;
                    updateGame(g.id,s1,s2);
                  }}>Save</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="card">
        <h3 style={{marginTop:0}}>Danger Zone</h3>
        <button className="btn danger" onClick={resetData}>Remove Test Data</button>
      </div>
    </section>
  );
}
