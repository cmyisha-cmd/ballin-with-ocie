import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_BASE || 'https://ballin-with-ocie.onrender.com';
const PASS = 'admin123';

export default function Admin(){
  const [ok, setOk] = useState(false);
  const [regs, setRegs] = useState([]);
  const [tix, setTix] = useState([]);
  const [scores, setScores] = useState([]);
  const [status, setStatus] = useState('');

  const load = async ()=>{
    const [r1,r2,r3] = await Promise.all([
      fetch(`${API}/api/admin/registrations`),
      fetch(`${API}/api/admin/tickets`),
      fetch(`${API}/api/leaderboard`),
    ]);
    setRegs(await r1.json());
    setTix(await r2.json());
    setScores(await r3.json());
  };

  useEffect(()=>{ if(ok) load(); }, [ok]);

  const updateScore = async (idx, field, value)=>{
    const body = { index: idx, field, value };
    await fetch(`${API}/api/admin/score`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    load();
  };

  const autoTeams = async ()=>{
    setStatus('Assigning teams…');
    await fetch(`${API}/api/admin/auto-teams`, { method:'POST' });
    setStatus('Teams assigned (check server logs/sample).');
  };

  if(!ok){
    return <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-4">Admin Login</h2>
      <button onClick={()=>setOk(window.prompt('Password?')===PASS)} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 font-semibold">Enter</button>
    </div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Admin Dashboard</h2>
        <button onClick={autoTeams} className="px-4 py-2 rounded bg-black border border-primary/50 hover:bg-primary/20">Auto-Assign Teams</button>
      </div>
      <div className="text-sm text-purple-200">{status}</div>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Shooting Contest Scores</h3>
        <div className="overflow-auto rounded-xl border border-primary/30 bg-ink/80">
          <table className="min-w-full text-sm">
            <thead className="bg-black/60"><tr><th className="px-3 py-2 text-left">Player</th><th className="px-3 py-2">Score</th><th className="px-3 py-2">Time (s)</th></tr></thead>
            <tbody>
              {scores.map((s,i)=>(
                <tr key={i} className="odd:bg-black/40 even:bg-black/20">
                  <td className="px-3 py-2">{s.name}</td>
                  <td className="px-3 py-2"><input className="w-20 text-black rounded px-2 py-1" defaultValue={s.score} onBlur={e=>updateScore(i,'score',Number(e.target.value))}/></td>
                  <td className="px-3 py-2"><input className="w-24 text-black rounded px-2 py-1" defaultValue={s.time} onBlur={e=>updateScore(i,'time',Number(e.target.value))}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Registrations</h3>
        <ul className="space-y-2">
          {regs.map((r,i)=>(<li key={i} className="p-3 rounded bg-black/50 border border-primary/30">{r.name} — age {r.age} — shooting: {r?.events?.shooting?'Yes':'No'} — team: {r?.events?.team?'Yes':'No'}</li>))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Ticket Requests</h3>
        <ul className="space-y-2">
          {tix.map((t,i)=>(<li key={i} className="p-3 rounded bg-black/50 border border-primary/30">{t.name} — {t.count} tickets</li>))}
        </ul>
      </section>
    </div>
  );
}