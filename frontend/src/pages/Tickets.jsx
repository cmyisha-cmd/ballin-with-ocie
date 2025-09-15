import { useState } from 'react';
import { API } from '../utils/api';

export default function Tickets(){
  const [form, setForm] = useState({ name:'', count:1, contact:'' });
  const [status, setStatus] = useState('');

  const submit = async (e)=>{
    e.preventDefault();
    setStatus('Submitting...');
    const res = await fetch(`${API}/api/tickets`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    });
    if(res.ok){
      setStatus('✅ Thank you! Your tickets will be available at the Box Office.');
      setForm({ name:'', count:1, contact:'' });
    } else {
      setStatus('❌ Error submitting.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-white">
      <h3 className="text-3xl font-bold mb-6 text-purple-400">Get Tickets</h3>
      <form onSubmit={submit} className="space-y-4 bg-nbaDark/60 p-6 rounded-xl border border-purple-900/40">
        <input className="w-full p-3 rounded bg-black/60 border border-purple-800" placeholder="Your Name"
          value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />
        <input type="number" min="1" className="w-full p-3 rounded bg-black/60 border border-purple-800" placeholder="Ticket Count"
          value={form.count} onChange={e=>setForm(f=>({...f, count: Number(e.target.value)}))} required />
        <input className="w-full p-3 rounded bg-black/60 border border-purple-800" placeholder="Contact (email or phone)"
          value={form.contact} onChange={e=>setForm(f=>({...f, contact:e.target.value}))} />
        <button className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold">Request</button>
        <div className="text-sm opacity-90">{status}</div>
      </form>
    </div>
  );
}
