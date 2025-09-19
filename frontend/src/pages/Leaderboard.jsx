import React, { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com'

function parseTime(t){ if(!t) return Infinity; const [m,s]=String(t).split(':').map(n=>parseInt(n,10)||0); return m*60+s }

export default function Leaderboard(){
  const [shooting, setShooting] = useState([])

  async function load(){
    try{
      const r = await fetch(`${API_URL}/api/shooting`)
      const data = await r.json()
      const sorted = (data||[]).slice().sort((a,b)=> (b.score||0)-(a.score||0) || (parseTime(a.time)-parseTime(b.time)) )
      setShooting(sorted)
    }catch(e){}
  }
  useEffect(()=>{ load(); const t=setInterval(load,5000); return ()=>clearInterval(t) }, [])

  return (
    <section className="card" style={{margin:'28px 0', padding:'16px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Shooting Contest Leaderboard</h2>
        <span className="pill">{(shooting||[]).length} players</span>
      </div>
      <table style={{marginTop:10}}>
        <thead><tr><th>Rank</th><th>Player</th><th>Score</th><th>Time (mm:ss)</th></tr></thead>
        <tbody>
          {(shooting||[]).length===0 ? (
            <tr><td colSpan="4" className="muted">No shooting entries yet.</td></tr>
          ) : (
            shooting.map((p,i)=>(
              <tr key={p.id}><td>{i+1}</td><td>{p.name}</td><td>{p.score||0}</td><td>{p.time||'00:00'}</td></tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
