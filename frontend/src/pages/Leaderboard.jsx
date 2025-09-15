import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_BASE || 'https://ballin-with-ocie.onrender.com';

export default function Leaderboard(){
  const [rows, setRows] = useState([]);

  const load = async ()=>{
    const r = await fetch(`${API}/api/leaderboard`);
    const d = await r.json();
    setRows(d);
  };
  useEffect(()=>{ load(); const id=setInterval(load, 4000); return ()=>clearInterval(id); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-6">Shooting Contest Leaderboard</h2>
      <div className="overflow-auto rounded-xl border border-primary/30 bg-ink/80">
        <table className="min-w-full text-sm">
          <thead className="bg-black/60">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-left">Score</th>
              <th className="px-4 py-3 text-left">Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} className="odd:bg-black/40 even:bg-black/20">
                <td className="px-4 py-3">{i+1}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.score}</td>
                <td className="px-4 py-3">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}