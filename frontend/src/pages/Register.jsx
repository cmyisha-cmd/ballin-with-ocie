import { useState } from 'react';
const API = import.meta.env.VITE_API_BASE || '';
export default function Register(){
  const [form, setForm] = useState({ name:'', age:'', events:{shooting:false, team:false} });
  const [ok, setOk] = useState('');
  const submit = async (e)=>{
    e.preventDefault();
    const res = await fetch(`${API}/api/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    setOk(res.ok ? '✅ Registered!' : '❌ Error');
    if(res.ok) setForm({ name:'', age:'', events:{shooting:false, team:false} });
  };
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-6">Register as a Player</h2>
      <form onSubmit={submit} className="space-y-4 bg-ink/80 border border-primary/30 p-6 rounded-xl">
        <input className="w-full p-3 rounded bg-black/60 border border-primary/40" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />
        <input className="w-full p-3 rounded bg-black/60 border border-primary/40" placeholder="Age" type="number" value={form.age} onChange={e=>setForm(f=>({...f, age:e.target.value}))} required />
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.events.shooting} onChange={e=>setForm(f=>({...f, events:{...f.events, shooting:e.target.checked}}))}/> Shooting Contest</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.events.team} onChange={e=>setForm(f=>({...f, events:{...f.events, team:e.target.checked}}))}/> Team Tournament</label>
        </div>
        <button className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 font-semibold">Submit</button>
        <div className="text-sm">{ok}</div>
      </form>
    </div>
  );
}