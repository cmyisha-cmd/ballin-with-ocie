import { useEffect, useState } from 'react'
import axios from 'axios'
const API = __API_BASE__ || ''

export default function Leaderboard(){
  const [rows, setRows] = useState([])
  async function load(){
    const res = await axios.get(`${API}/api/shooting`)
    setRows(res.data || [])
  }
  useEffect(()=>{ load(); const id=setInterval(load, 5000); return ()=>clearInterval(id)},[])
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="h2 mb-4">Shooting Contest Leaderboard</h2>
      <div className="card overflow-x-auto">
        <table className="table">
          <thead><tr><th>Player</th><th>Score</th><th>Time (mm:ss)</th><th>Rank</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.id} className="border-t border-white/5">
                <td>{r.name}</td><td>{r.score}</td><td>{r.time}</td><td>#{i+1}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 text-sm text-gray-400">Total contestants: {rows.length}</div>
      </div>
    </div>
  )
}
