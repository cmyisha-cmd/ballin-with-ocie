import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Leaderboard(){
  const [rows, setRows] = useState([])
  const load = async ()=>{
    const res = await api.get('/api/shooting'); setRows(res.data || [])
  }
  useEffect(()=>{ load(); const t=setInterval(load, 5000); return ()=>clearInterval(t) }, [])

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h3 className="text-2xl font-bold text-purple-400 mb-4">Shooting Contest Leaderboard</h3>
      <div className="bg-neutral-900/60 border border-neutral-700 rounded">
        <table className="w-full text-sm">
          <thead className="text-neutral-300">
            <tr>
              <th className="text-left p-3 border-b border-neutral-700/80">#</th>
              <th className="text-left p-3 border-b border-neutral-700/80">Player</th>
              <th className="text-left p-3 border-b border-neutral-700/80">Score</th>
              <th className="text-left p-3 border-b border-neutral-700/80">Time (mm:ss)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.id} className="odd:bg-neutral-900/60">
                <td className="p-3">{i+1}</td>
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.score}</td>
                <td className="p-3">{r.time}</td>
              </tr>
            ))}
            {rows.length===0 && (
              <tr><td className="p-4 text-neutral-400" colSpan="4">No participants yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
