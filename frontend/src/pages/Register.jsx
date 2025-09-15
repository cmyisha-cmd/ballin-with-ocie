import { useState } from 'react';
import { API } from '../utils/api';

export default function Register(){
  const [form, setForm] = useState({ name:'', age:'', events: { shooting:true, team:true }, contact:''});
  const [status, setStatus] = useState('');

  const submit = async (e)=>{
    e.preventDefault();
    setStatus('Submitting...');
    const res = await fetch(`${API}/api/register`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    });
    if(res.ok){
      setStatus('✅ Registered!');
      setForm({ name:'', age:'', events:{shooting:true, team:true}, contact:'' });
    } else {
      setStatus('❌ Error submitting.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-white">
      <h3 className="text-3xl font-bold mb-6 text-purple-400">Register to Play</h3>
      <form onSubmit={submit} className="space-y-4 bg-nbaDark/60 p-6 rounded-xl border border-purple-900/40">
        <input className="w-full p-3 rounded bg-black/60 border border-purple-800" placeholder="Full Name"
          value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />
        <input type="number" min="5" max="99" className="w-full p-3 rounded bg-black/60 border border-purple-800" placeholder="Age"
          value={form.age} onChange={e=>setForm(f=>({...f, age:e.target.value}))} required />
        <input className="w-full p-3 rounded bg-black/60 border border-purple-800" placeholder="Contact (email or phone)"
          value={form.contact} onChange={e=>setForm(f=>({...f, contact:e.target.value}))} />
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.events.shooting}
              onChange={e=>setForm(f=>({...f, events:{...f.events, shooting:e.target.checked}}))} />
            Shooting Contest
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.events.team}
              onChange={e=>setForm(f=>({...f, events:{...f.events, team:e.target.checked}}))} />
            Team Tournament
          </label>
        </div>
        <button className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold">Submit</button>
        <div className="text-sm opacity-90">{status}</div>
      </form>
    </div>
  );
}
