import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_BASE || '';

export default function Messages(){
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const load = async ()=>{
    const r = await fetch(`${API}/api/messages`);
    setItems(await r.json());
  };
  useEffect(()=>{ load(); }, []);

  const submit = async (e)=>{
    e.preventDefault();
    await fetch(`${API}/api/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, text, ts: Date.now() }) });
    setName(''); setText(''); load();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary mb-6">Birthday Wall</h2>
      <form onSubmit={submit} className="space-y-3 mb-6 bg-ink/80 border border-primary/30 p-6 rounded-xl">
        <input className="w-full p-3 rounded bg-black/60 border border-primary/40" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} required />
        <textarea className="w-full p-3 rounded bg-black/60 border border-primary/40" rows="3" placeholder="Type a message…" value={text} onChange={e=>setText(e.target.value)} required />
        <button className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 font-semibold">Send</button>
      </form>
      <div className="space-y-3">
        {items.map((m,i)=>(
          <div key={i} className="p-4 rounded-xl bg-black/50 border border-primary/30">
            <div className="text-sm text-purple-300">{m.name}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}