import { useEffect, useState } from 'react';
import { API } from '../utils/api';

const PASS = 'admin123';

export default function Admin(){
  const [ok, setOk] = useState(false);
  const [reg, setReg] = useState([]);
  const [tix, setTix] = useState([]);
  const [status, setStatus] = useState('');

  const load = async ()=>{
    const [r1, r2] = await Promise.all([
      fetch(`${API}/api/admin/registrations`),
      fetch(`${API}/api/admin/tickets`)
    ]);
    setReg(await r1.json());
    setTix(await r2.json());
  };

  useEffect(()=>{ if(ok) load(); }, [ok]);

  const resetData = async ()=>{
    setStatus('Resetting...');
    await fetch(`${API}/api/admin/reset`, { method:'POST' });
    setStatus('✅ Reset complete. Add some new entries to test.');
    load();
  };

  if(!ok){
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-white">
        <h3 className="text-3xl font-bold mb-6 text-purple-400">Admin Login</h3>
        <button onClick={()=>setOk(window.prompt('Password?')===PASS)} className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold">
          Enter Password
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-purple-400">Admin Dashboard</h3>
        <button onClick={resetData} className="px-4 py-2 rounded bg-black border border-purple-700 hover:bg-purple-800/40">
          Reset Test Data
        </button>
      </div>
      <div className="text-sm opacity-90">{status}</div>

      <section>
        <h4 className="text-xl font-semibold mb-3 text-purple-300">Registrations</h4>
        <div className="overflow-auto rounded-xl border border-purple-900/40 bg-nbaDark/60">
          <table className="min-w-full text-sm">
            <thead className="bg-black/60">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Age</th>
                <th className="px-4 py-3 text-left">Shooting</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-left">Contact</th>
              </tr>
            </thead>
            <tbody>
              {reg.map((r,i)=>(
                <tr key={i} className="odd:bg-black/40 even:bg-black/20">
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.age}</td>
                  <td className="px-4 py-3">{r?.events?.shooting ? 'Yes':'No'}</td>
                  <td className="px-4 py-3">{r?.events?.team ? 'Yes':'No'}</td>
                  <td className="px-4 py-3">{r.contact||''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4 className="text-xl font-semibold mb-3 text-purple-300">Ticket Requests</h4>
        <div className="overflow-auto rounded-xl border border-purple-900/40 bg-nbaDark/60">
          <table className="min-w-full text-sm">
            <thead className="bg-black/60">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Count</th>
                <th className="px-4 py-3 text-left">Contact</th>
              </tr>
            </thead>
            <tbody>
              {tix.map((t,i)=>(
                <tr key={i} className="odd:bg-black/40 even:bg-black/20">
                  <td className="px-4 py-3">{t.name}</td>
                  <td className="px-4 py-3">{t.count}</td>
                  <td className="px-4 py-3">{t.contact||''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
