import { useState } from 'react';
const API = import.meta.env.VITE_API_BASE || 'https://ballin-with-ocie.onrender.com';

export default function Tickets(){
  const [form, setForm] = useState({ name:'', count:1 });
  const [ok, setOk] = useState('');

  const submit = async (e)=>{
    e.preventDefault();
    const res = await fetch(`${API}/api/tickets`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    });
    setOk(res.ok ? '✅ Thank you! Your tickets will be available at the Box Office' : '❌ Error');
    if(res.ok) setForm({ name:'', count:1 });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-6">Get Tickets</h2>
      <form onSubmit={submit} className="space-y-4 bg-ink/80 border border-primary/30 p-6 rounded-xl">
        <input className="w-full p-3 rounded bg-black/60 border border-primary/40" placeholder="Your Name" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />
        <input className="w-full p-3 rounded bg-black/60 border border-primary/40" placeholder="Ticket Count" type="number" min="1" value={form.count} onChange={e=>setForm(f=>({...f, count:Number(e.target.value)}))} required />
        <button className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 font-semibold">Request</button>
        <div className="text-sm">{ok}</div>
      </form>
    </div>
  );
}