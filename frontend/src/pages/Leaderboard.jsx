import { useEffect, useState } from 'react'

export default function Leaderboard() {
  const [rows, setRows] = useState([])
  const load = async () => {
    const res = await fetch('/api/leaderboard')
    setRows(await res.json())
  }
  useEffect(()=>{ load(); const t=setInterval(load, 10000); return ()=>clearInterval(t) }, [])
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-4">Shooting Contest Leaderboard</h2>
      <div className="overflow-x-auto card">
        <table className="w-full text-left">
          <thead className="text-neutral-400">
            <tr>
              <th className="py-2">#</th>
              <th className="py-2">Player</th>
              <th className="py-2">Score</th>
              <th className="py-2">Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t border-neutral-800">
                <td className="py-2">{i+1}</td>
                <td className="py-2">{r.name}</td>
                <td className="py-2">{r.score}</td>
                <td className="py-2">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
