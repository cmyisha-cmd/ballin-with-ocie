import { useEffect, useState } from 'react'

export default function Leaderboard(){
  const [rows, setRows] = useState([])
  async function load(){ setRows(await (await fetch('/api/shooting')).json()) }
  useEffect(()=>{ load(); const id = setInterval(load, 4000); return ()=>clearInterval(id) },[])
  return (
    <div className="card">
      <h3 className="text-xl font-bold text-purple-400 mb-3">Shooting Contest Leaderboard</h3>
      <div className="text-sm text-zinc-400 mb-2">Players: <b>{rows.length}</b></div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-zinc-300">
            <tr><th className="text-left p-2">Player</th><th className="text-right p-2">Score</th><th className="text-right p-2">Time (mm:ss)</th></tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.id} className={i%2? 'bg-zinc-800/40':''}>
                <td className="p-2">{r.name}</td>
                <td className="p-2 text-right font-bold">{r.score ?? 0}</td>
                <td className="p-2 text-right">{r.time || '00:00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
