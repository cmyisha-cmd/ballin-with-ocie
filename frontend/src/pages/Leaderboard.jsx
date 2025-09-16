import { useEffect, useState } from 'react'
import { getJSON } from '../api'

export default function Leaderboard(){
  const [rows,setRows]=useState([])
  const [count,setCount]=useState(0)
  useEffect(()=>{
    (async()=>{
      const data = await getJSON('/leaderboard')
      setRows(data.leaderboard||[]); setCount(data.count||0)
    })()
  },[])

  return (
    <div className="container" style={{padding:'2rem 1rem'}}>
      <div className="row" style={{alignItems:'baseline'}}>
        <h2 className="col">Shooting Contest Leaderboard</h2>
        <div className="tag">Players in Shooting: {count}</div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>#</th><th>Player</th><th>Score</th><th>Time</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.id}><td>{i+1}</td><td>{r.name}</td><td>{r.score ?? '-'}</td><td>{r.time ?? '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
