import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Leaderboard(){
  const [rows, setRows] = useState([])

  const load = async ()=>{
    const list = await api.getShooting()
    setRows(list)
  }
  useEffect(()=>{
    load()
    const t = setInterval(load, 5000)
    return ()=> clearInterval(t)
  }, [])

  return (
    <section className="container-nba py-10">
      <h2 className="text-3xl font-black text-nbaPurple">Shooting Contest Leaderboard</h2>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-400">
            <tr><th className="py-2">#</th><th>Name</th><th>Score</th><th>Time</th></tr>
          </thead>
        </table>
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.id} className="border-t border-zinc-800">
                <td className="py-2 px-2 text-zinc-400">{i+1}</td>
                <td className="px-2">{r.name}</td>
                <td className="px-2 font-bold">{r.score}</td>
                <td className="px-2">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
