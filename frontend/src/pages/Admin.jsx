import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_BASE || '';
const PASS = 'admin123';

function parseMMSS(mm, ss){ return Math.max(0,(Number(mm)||0)*60 + (Number(ss)||0)); }
function fromTotal(total){ const m=Math.floor((total||0)/60), s=(total||0)-m*60; return {mm:String(m).padStart(2,'0'), ss:String(s).padStart(2,'0')}; }

export default function Admin(){
  const [ok, setOk] = useState(false);
  const [regs, setRegs] = useState([]);
  const [tix, setTix] = useState([]);
  const [shooters, setShooters] = useState([]);
  const [teams, setTeams] = useState({});
  const [ticketTotal, setTicketTotal] = useState(0);
  const [status, setStatus] = useState('');

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

  const autoTeams = async ()=>{ setStatus('Assigning teams…'); await fetch(`${API}/api/admin/auto-teams`, { method:'POST' }); setStatus('Teams assigned.'); await load(); };
  const resetAll = async ()=>{ setStatus('Clearing test data…'); await fetch(`${API}/api/admin/reset`, { method:'POST' }); setStatus('All test data cleared.'); await load(); };

  if(!ok) return <div className="max-w-md mx-auto px-4 py-10"><h2 className="text-3xl font-bold text-primary mb-4">Admin Login</h2><button onClick={()=>setOk(window.prompt('Password?')===PASS)} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 font-semibold">Enter</button></div>;

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
        <h3 className="text-xl font-semibold mb-2 text-purple-300">Registered Players</h3>
        <div className="overflow-auto rounded-xl border border-primary/30 bg-ink/80 mb-6">
          <table className="min-w-full text-sm">
            <thead className="bg-black/60"><tr><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2">Age</th><th className="px-3 py-2">Shooting</th><th className="px-3 py-2">Team</th></tr></thead>
            <tbody>
              {regs.map(r=>(
                <tr key={r.id} className="odd:bg-black/40 even:bg-black/20">
                  <td className="px-3 py-2 text-left">{r.name}</td>
                  <td className="px-3 py-2">{r.age}</td>
                  <td className="px-3 py-2">{r?.events?.shooting?'✅':'—'}</td>
                  <td className="px-3 py-2">{r?.events?.team?'✅':'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Shooting Contest — Players & Scores (MM:SS)</h3>
        <div className="overflow-auto rounded-xl border border-primary/30 bg-ink/80">
          <table className="min-w-full text-sm">
            <thead className="bg-black/60"><tr><th className="px-3 py-2 text-left">Player</th><th className="px-3 py-2">Score</th><th className="px-3 py-2">MM</th><th className="px-3 py-2">SS</th><th className="px-3 py-2">Save</th></tr></thead>
            <tbody>
              {shooters.map((s)=> (<ShooterRow key={s.id} s={s} onSaved={load}/>))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-purple-300">Teams</h3>
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

function ShooterRow({ s, onSaved }){
  const [score, setScore] = useState(s.score||0);
  const t = fromTotal(s.totalSeconds||0);
  const [m, setM] = useState(t.mm);
  const [sec, setSec] = useState(t.ss);

  const save = async ()=>{
    const total = parseMMSS(m, sec);
    await fetch(`${API}/api/admin/shooting/${s.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ score:Number(score)||0, minutes:Number(m)||0, seconds:Number(sec)||0 }) });
    onSaved && onSaved();
  };

  return (
    <tr className="odd:bg-black/40 even:bg-black/20">
      <td className="px-3 py-2">{s.name}</td>
      <td className="px-3 py-2"><input className="w-20 text-black rounded px-2 py-1" value={score} onChange={e=>setScore(e.target.value)}/></td>
      <td className="px-3 py-2"><input className="w-16 text-black rounded px-2 py-1" value={m} onChange={e=>setM(e.target.value)}/></td>
      <td className="px-3 py-2"><input className="w-16 text-black rounded px-2 py-1" value={sec} onChange={e=>setSec(e.target.value)}/></td>
      <td className="px-3 py-2"><button className="px-3 py-1 rounded bg-primary hover:bg-primary/80" onClick={save}>Save</button></td>
    </tr>
  );
}
