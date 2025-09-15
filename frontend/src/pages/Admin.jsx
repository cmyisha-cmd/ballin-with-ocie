import { useEffect, useMemo, useState } from 'react';
const API = import.meta.env.VITE_API_BASE || '';
const PASS = 'admin123';

export default function Admin(){
  const [ok, setOk] = useState(false);
  const [regs, setRegs] = useState([]);
  const [tix, setTix] = useState([]);
  const [shooters, setShooters] = useState([]);
  const [teams, setTeams] = useState({});
  const [ticketTotal, setTicketTotal] = useState(0);
  const [status, setStatus] = useState('');

  const eligible = useMemo(()=> regs.filter(r=>r?.events?.shooting && !shooters.find(s=>s.name===r.name)), [regs, shooters]);

  const load = async ()=>{
    const [r1, r2, r3, r4, r5] = await Promise.all([
      fetch(`${API}/api/admin/registrations`),
      fetch(`${API}/api/admin/tickets`),
      fetch(`${API}/api/admin/shooting`),
      fetch(`${API}/api/admin/teams`),
      fetch(`${API}/api/admin/tickets/total`)
    ]);
    setRegs(await r1.json());
    setTix(await r2.json());
    setShooters(await r3.json());
    setTeams(await r4.json());
    setTicketTotal((await r5.json()).total || 0);
  };

  useEffect(()=>{ if(ok) load(); }, [ok]);

  const saveRow = async (id, score, time)=>{
    await fetch(`${API}/api/admin/shooting/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ score:Number(score)||0, time:Number(time)||0 }) });
    await load();
  };

  const autoTeams = async ()=>{
    setStatus('Assigning teams…');
    await fetch(`${API}/api/admin/auto-teams`, { method:'POST' });
    setStatus('Teams assigned.');
    await load();
  };

  const resetAll = async ()=>{
    setStatus('Clearing test data…');
    await fetch(`${API}/api/admin/reset`, { method:'POST' });
    setStatus('All test data cleared.');
    await load();
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
        <div className="flex gap-2">
          <button onClick={autoTeams} className="px-4 py-2 rounded bg-black border border-primary/50 hover:bg-primary/20">Auto-Assign Teams</button>
          <button onClick={resetAll} className="px-4 py-2 rounded bg-black border border-primary/50 hover:bg-primary/20">Remove Test Data</button>
        </div>
      </div>
      <div className="text-sm text-purple-200">{status}</div>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Shooting Contest — Players & Scores</h3>
        <p className="text-sm text-purple-300 mb-2">Players who register and select <b>Shooting Contest</b> are auto-added below.</p>
        <div className="overflow-auto rounded-xl border border-primary/30 bg-ink/80">
          <table className="min-w-full text-sm">
            <thead className="bg-black/60"><tr><th className="px-3 py-2 text-left">Player</th><th className="px-3 py-2">Score</th><th className="px-3 py-2">Time (s)</th><th className="px-3 py-2">Save</th></tr></thead>
            <tbody>
              {shooters.map((s)=>(
                <Row key={s.id} s={s} onSave={saveRow}/>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Teams (after Auto-Assign)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(teams||{}).map(([team, players])=>(
            <div key={team} className="p-4 rounded-xl bg-black/50 border border-primary/30">
              <div className="font-bold text-primary mb-2">{team}</div>
              <ul className="list-disc list-inside text-sm">
                {players.map((p,i)=>(<li key={i}>{p}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Ticket Requests — Total: <span className="font-black">{ticketTotal}</span></h3>
        <ul className="space-y-2">
          {tix.map((t,i)=>(<li key={i} className="p-3 rounded bg-black/50 border border-primary/30">{t.name} — {t.quantity} tickets</li>))}
        </ul>
      </section>
    </div>
  );
}

function Row({ s, onSave }){
  const [score, setScore] = useState(s.score||0);
  const [time, setTime] = useState(s.time||0);
  return (
    <tr className="odd:bg-black/40 even:bg-black/20">
      <td className="px-3 py-2">{s.name}</td>
      <td className="px-3 py-2"><input className="w-20 text-black rounded px-2 py-1" value={score} onChange={e=>setScore(e.target.value)}/></td>
      <td className="px-3 py-2"><input className="w-24 text-black rounded px-2 py-1" value={time} onChange={e=>setTime(e.target.value)}/></td>
      <td className="px-3 py-2"><button className="px-3 py-1 rounded bg-primary hover:bg-primary/80" onClick={()=>onSave(s.id, score, time)}>Save</button></td>
    </tr>
  );
}
