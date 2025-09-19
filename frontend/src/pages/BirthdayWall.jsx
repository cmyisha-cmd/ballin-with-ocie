import React, { useEffect, useState } from 'react';

const API_URL = "https://ballin-with-ocie.onrender.com";
const EMOJIS = ['🎉','🎂','🏀','🔥','👍','❤️','🙌'];

export default function BirthdayWall(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:'', text:'' });

  async function load(){ try{ const r=await fetch(`${API_URL}/api/messages`); setList(await r.json()) }catch{} }
  useEffect(()=>{ load(); const t=setInterval(load, 8000); return ()=>clearInterval(t) }, []);

  async function post(e){
    e.preventDefault();
    if(!form.name || !form.text) return;
    await fetch(`${API_URL}/api/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    setForm({ name:'', text:'' });
    load();
  }
  async function react(id, emoji){
    await fetch(`${API_URL}/api/messages/${id}/react`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({emoji}) });
    load();
  }
  async function reply(id, name, text){
    if(!name || !text) return;
    await fetch(`${API_URL}/api/messages/${id}/reply`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, text}) });
    load();
  }

  return (
    <section style={{margin:'28px 0'}}>
      <div className="card">
        <h2>Birthday Wall 🎉</h2>
        <form onSubmit={post}>
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Your Name" required />
          <textarea value={form.text} onChange={e=>setForm({...form, text:e.target.value})} placeholder="Message" required />
          <div className="cta"><button className="btn">Post</button></div>
        </form>
      </div>
      <div className="grid">
        {list.map(msg=>(
          <div key={msg.id} className="card">
            <strong>{msg.name}</strong>
            <p>{msg.text}</p>
            <div>{EMOJIS.map(e=>(<button key={e} onClick={()=>react(msg.id,e)}>{e} {msg.reactions?.[e]||0}</button>))}</div>
            <div>
              <strong>Replies</strong>
              <ul>{(msg.replies||[]).map((r,i)=>(<li key={i}><b>{r.name}:</b> {r.text}</li>))}</ul>
              <ReplyForm onSubmit={(n,t)=>reply(msg.id,n,t)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReplyForm({onSubmit}){
  const [name,setName]=useState(''), [text,setText]=useState('');
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(name,text); setName(''); setText('')}}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required />
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Reply" required />
      <button type="submit">Reply</button>
    </form>
  );
}