import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  const [leaders, setLeaders] = useState([])
  const [count, setCount] = useState(0)
  async function load(){
    try{
      const res = await fetch('/api/shooting')
      const data = await res.json()
      setLeaders(data || [])
      setCount((data||[]).length)
    }catch(e){}
  }
  useEffect(()=>{ load(); const t=setInterval(load, 8000); return ()=>clearInterval(t) },[])

  return (
    <section className="hero">
      <div>
        <h1>Welcome to Ballin’ with Ocie!</h1>
        <p className="muted">Register for the Shooting Contest and Team Tournament, secure tickets, and leave a birthday message. Track live scores and brackets during the event.</p>
        <div className="cta">
          <Link className="btn" to="/register">Register to Play</Link>
          <Link className="btn" to="/tickets">Get Tickets</Link>
          <Link className="btn" to="/birthday">Leave a Birthday Wish</Link>
          <a className="btn" href="#leaders">View Leaderboard</a>
        </div>
      </div>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3 style={{margin:0}}>Shooting Contest Leaderboard</h3>
          <span className="pill">{count} players</span>
        </div>
        <table id="leaders" style={{marginTop:10}}>
          <thead><tr><th>#</th><th>Name</th><th>Score</th><th>Time (mm:ss)</th></tr></thead>
          <tbody>
            {leaders.map((p,i)=>(
              <tr key={p.id}><td>{i+1}</td><td>{p.name}</td><td>{p.score}</td><td>{p.time}</td></tr>
            ))}
            {leaders.length===0 && <tr><td colSpan="4" className="muted">No entries yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}
