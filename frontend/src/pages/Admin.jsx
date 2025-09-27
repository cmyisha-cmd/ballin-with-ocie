import React, { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com'

export default function Admin(){
  const [pass, setPass] = useState('')
  const [ok, setOk] = useState(false)

  const [players, setPlayers] = useState([])
  const [shooting, setShooting] = useState([])
  const [tickets, setTickets] = useState([])
  const [teams, setTeams] = useState({A:[], B:[]})
  const [bracket, setBracket] = useState(null)

  async function loadAll(){
    try{
      const [p,s,t,tm] = await Promise.all([
        fetch(`${API_URL}/api/players`).then(r=>r.json()),
        fetch(`${API_URL}/api/shooting`).then(r=>r.json()),
        fetch(`${API_URL}/api/tickets`).then(r=>r.json()),
        fetch(`${API_URL}/api/teams`).then(r=>r.json())
      ])
      setPlayers(p||[]); setShooting(s||[]); setTickets(t||[]); setTeams(tm||{A:[],B:[]});
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

  async function saveScore(id, score, time){
    await fetch(`${API_URL}/api/shooting/${id}`, { 
      method:'PATCH', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({score:Number(score||0), time}) 
    })
    loadAll()
  }
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
      {/* Shooting Contest */}
      <div className="card">
        <h3 style={{marginTop:0}}>Shooting Contest</h3>
        <table>
          <thead><tr><th>Player</th><th>Score</th><th>Time (mm:ss)</th><th></th></tr></thead>
          <tbody>
            {shooting.map(p=>{
              const [mm,ss] = String(p.time||'00:00').split(':')
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
                      const s = document.getElementById(`s-${p.id}`).value
                      const m = document.getElementById(`m-${p.id}`).value.padStart(2,'0')
                      const x = document.getElementById(`x-${p.id}`).value.padStart(2,'0')
                      saveScore(p.id, s, `${m}:${x}`)
                    }}>Save</button>
                    <button className='btn danger' onClick={()=>{
                      fetch(`${API_URL}/api/shooting/${p.id}`, {
                        method:'DELETE',
                        headers:{'x-admin-pass':'ocie2025'}
                      }).then(()=>loadAll())
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
          <div><h4>Team A</h4>
          <input type='text' id='newA' placeholder='New member name' />
          <button className='btn' onClick={()=>{
            const n=document.getElementById('newA').value;
            if(!n) return;
            fetch(`${API_URL}/api/teams/A`,{
              method:'POST',
              headers:{'Content-Type':'application/json','x-admin-pass':'ocie2025'},
              body:JSON.stringify({name:n})
            }).then(()=>loadAll())
          }}>Add to Team A</button>
          <ul>{teams.A.map(t=>
            <li key={t.id}>
              {t.name}
              <button className='btn danger' onClick={()=>{
                fetch(`${API_URL}/api/teams/A/${t.id}`,{
                  method:'DELETE',
                  headers:{'x-admin-pass':'ocie2025'}
                }).then(()=>loadAll())
              }}>Delete</button>
              <input type='text' defaultValue={t.name} id={`editA-${t.id}`} />
              <button className='btn' onClick={()=>{
                const newName=document.getElementById(`editA-${t.id}`).value;
                fetch(`${API_URL}/api/teams/A/${t.id}`,{
                  method:'PATCH',
                  headers:{'Content-Type':'application/json','x-admin-pass':'ocie2025'},
                  body:JSON.stringify({name:newName})
                }).then(()=>loadAll())
              }}>Update</button>
            </li>
          )}</ul></div>
          <div><h4>Team B</h4>
          <input type='text' id='newB' placeholder='New member name' />
          <button className='btn' onClick={()=>{
            const n=document.getElementById('newB').value;
            if(!n) return;
            fetch(`${API_URL}/api/teams/B`,{
              method:'POST',
              headers:{'Content-Type':'application/json','x-admin-pass':'ocie2025'},
              body:JSON.stringify({name:n})
            }).then(()=>loadAll())
          }}>Add to Team B</button>
          <ul>{teams.B.map(t=>
            <li key={t.id}>
              {t.name}
              <button className='btn danger' onClick={()=>{
                fetch(`${API_URL}/api/teams/B/${t.id}`,{
                  method:'DELETE',
                  headers:{'x-admin-pass':'ocie2025'}
                }).then(()=>loadAll())
              }}>Delete</button>
              <input type='text' defaultValue={t.name} id={`editB-${t.id}`} />
              <button className='btn' onClick={()=>{
                const newName=document.getElementById(`editB-${t.id}`).value;
                fetch(`${API_URL}/api/teams/B/${t.id}`,{
                  method:'PATCH',
                  headers:{'Content-Type':'application/json','x-admin-pass':'ocie2025'},
                  body:JSON.stringify({name:newName})
                }).then(()=>loadAll())
              }}>Update</button>
            </li>
          )}</ul></div>
        </div>
      </div>

      {/* Tickets */}
      <div className="card">
        <h3 style={{marginTop:0}}>Tickets</h3>
        <p className="muted">Total requested: <strong>{(tickets||[]).reduce((a,b)=>a+Number(b.quantity||0),0)}</strong></p>
        <ul>{tickets.map(t=>(
          <li key={t.id}>
            {t.name} — 
            <input 
              type='number' 
              step='1' 
              min='1' 
              max='20'
              defaultValue={t.quantity} 
              style={{width:60}} 
              id={`tick-${t.id}`} 
            />
            <button className='btn' onClick={()=>{
              const q = document.getElementById(`tick-${t.id}`).value;
              fetch(`${API_URL}/api/tickets/${t.id}`,{
                method:'PATCH',
                headers:{'Content-Type':'application/json','x-admin-pass':'ocie2025'},
                body:JSON.stringify({quantity:q})
              }).then(()=>loadAll())
            }}>Update</button>
          </li>
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
          <>
            {bracket.semi && (
              <>
                <h4>Semifinals</h4>
                <ul>
                  {bracket.semi.map(g=>(
                    <li key={g.id}>
                      Game {g.game_no}: {g.team1 || 'TBD'} vs {g.team2 || 'TBD'} <br/>
                      <input type="number" id={`g${g.id}-s1`} defaultValue={g.score1} style={{width:50}}/> :
                      <input type="number" id={`g${g.id}-s2`} defaultValue={g.score2} style={{width:50}}/>
                      <button className="btn" onClick={async()=>{
                        const s1=document.getElementById(`g${g.id}-s1`).value;
                        const s2=document.getElementById(`g${g.id}-s2`).value;
                        await fetch(`${API_URL}/api/games/${g.id}`,{
                          method:'PATCH',
                          headers:{'Content-Type':'application/json','x-admin-pass':'ocie2025'},
                          body:JSON.stringify({score1:s1,score2:s2})
                        });
                        loadBracket();
                      }}>Save</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {bracket.final && (
              <>
                <h4>Final</h4>
                <ul>
                  {bracket.final.map(g=>(
                    <li key={g.id}>
                      Final: {g.team1 || 'TBD'} vs {g.team2 || 'TBD'} <br/>
                      <input type="number" id={`g${g.id}-s1`} defaultValue={g.score1} style={{width:50}}/> :
                      <input type="number" id={`g${g.id}-s2`} defaultValue={g.score2} style={{width:50}}/>
                      <button className="btn" onClick={async()=>{
                        const s1=document.getElementById(`g${g.id}-s1`).value;
                        const s2=document.getElementById(`g${g.id}-s2`).value;
                        await fetch(`${API_URL}/api/games/${g.id}`,{
                          method:'PATCH',
                          headers:{'Content-Type':'application/json','x-admin-pass':'ocie2025'},
                          body:JSON.stringify({score1:s1,score2:s2})
                        });
                        loadBracket();
                      }}>Save</button>
                    </li>
                  ))}
                </ul>

                {(() => {
                  const g = bracket.final[0];
                  if(g.score1 != null && g.score2 != null && g.score1 !== g.score2){
                    const champion = g.score1 > g.score2 ? g.team1 : g.team2;
                    return (
                      <div style={{marginTop:12, fontWeight:'bold', fontSize:'1.2em', color:'purple'}}>
                        🏆 Champion: Team {champion}
                      </div>
                    );
                  }
                  return null;
                })()}
              </>
            )}
          </>
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
