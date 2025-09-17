import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Leaderboard(){
  const [rows, setRows] = useState([])
  async function load(){ const d = await api('/shooting'); setRows(d) }
  useEffect(()=>{ load() }, [])

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Shooting Contest Leaderboard</h2>
          <button className="btn" onClick={load}>Refresh</button>
        </div>
        <table>
          <thead>
            <tr className="text-zinc-400">
              <th>#</th><th>Player</th><th>Score</th><th>Time (mm:ss)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.id}>
                <td>{i+1}</td><td>{r.name}</td><td>{r.score}</td><td>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
