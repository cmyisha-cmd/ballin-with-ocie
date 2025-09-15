import { useEffect, useState } from 'react';
import { API } from '../utils/api';

export default function Leaderboard(){
  const [rows, setRows] = useState([]);

  const load = async ()=>{
    const res = await fetch(`${API}/api/leaderboard`);
    const data = await res.json();
    setRows(data);
  };

  useEffect(()=>{
    load();
    const id = setInterval(load, 5000);
    return ()=>clearInterval(id);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <h3 className="text-3xl font-bold mb-6 text-purple-400">Shooting Contest Leaderboard</h3>
      <div className="overflow-auto rounded-xl border border-purple-900/40 bg-nbaDark/60">
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
