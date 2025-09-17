import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Leaderboard(){
  const [rows,setRows] = useState([])
  async function load(){ setRows(await api('/shooting')) }
  useEffect(()=>{ load(); const t=setInterval(load,3000); return ()=>clearInterval(t) },[])

  return (
    <div className="card">
      <h2 className="text-primary mb-4">Shooting Contest Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-white/70">
            <tr><th className="py-2">Player</th><th>Score</th><th>Time (MM:SS)</th></tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} className="border-t border-white/10">
                <td className="py-2">{r.name}</td>
                <td>{r.score}</td>
                <td>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
