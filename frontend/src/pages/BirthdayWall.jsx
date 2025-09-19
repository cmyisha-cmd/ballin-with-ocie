// src/pages/BirthdayWall.jsx
import React, { useEffect, useState } from 'react';

const API_URL = "https://ballin-with-ocie.onrender.com";
const EMOJIS = ['🎉','🎂','🏀','🔥','👍','❤️','🙌'];

function timeAgo(iso){
  if(!iso) return '';
  const t = new Date(iso);
  const s = Math.floor((Date.now()-t.getTime())/1000);
  if (s<60) return `${s}s ago`;
  const m=Math.floor(s/60); if(m<60) return `${m}m ago`;
  const h=Math.floor(m/60); if(h<24) return `${h}h ago`;
  const d=Math.floor(h/24); return `${d}d ago`;
}

export default function BirthdayWall(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:'', text:'' });
  const [admin, setAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  async function load(){
    try{
      const r = await fetch(`${API_URL}/api/messages`);
      if(!r.ok) throw new Error('load failed');
      setList(await r.json());
    }catch(e){ console.error('load', e); }
  }

  useEffect(()=>{ load(); const t=setInterval(load, 8000); return ()=>clearInterval(t) }, []);

  async function post(e){
    e.preventDefault();
    if(!form.name || !form.text) return;
    try{
      await fetch(`${API_URL}/api/messages`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      });
      setForm({name:'', text:''});
      load();
    }catch(e){ console.error('post', e); }
  }

  async function react(id, emoji){
    try{
      await fetch(`${API_URL}/api/messages/${id}/react`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({emoji})
      });
      load();
    }catch(e){ console.error('react', e); }
  }

  async function reply(id, name, text){
    if(!name || !text) return;
    try{
      await fetch(`${API_URL}/api/messages/${id}/reply`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({name, text})
      });
      load();
    }catch(e){ console.error('reply', e); }
  }

  async function del(id){
    if(!admin) return;
    try{
      await fetch(`${API_URL}/api/messages/${id}`, {
        method:'DELETE', headers:{'x-admin-pass':'ocie2025'}
      });
      load();
    }catch(e){ console.error('delete', e); }
  }

  function AdminBox(){
    if(admin) return <div className="pill">Admin mode</div>;
    return (
      <form onSubmit={(e)=>{e.preventDefault(); if(adminPass==='ocie2025') setAdmin(true); else alert('Wrong password')}} style={{display:'flex', gap:8, alignItems:'center'}}>
        <input placeholder="Admin password" type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} />
        <button className="btn" type="submit">Login</button>
      </form>
    );
  }

  return (
    <section style={{margin:'28px 0'}}>
      <div className="card" style={{marginBottom:16}}>
        <h2 style={{marginTop:0}}>Birthday Wall 🎉</h2>
        <form onSubmit={post}>
          <label>Your Name</label>
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <label>Message</label>
          <textarea value={form.text} onChange={e=>setForm({...form, text:e.target.value})} required placeholder="Type your message, add emojis below…" />
          <div className="emoji-row" style={{marginTop:8, display:'flex', gap:8, flexWrap:'wrap'}}>
            {EMOJIS.map(e=>(
              <button key={e} type="button" className="btn" onClick={()=>setForm({...form, text: form.text + e})}>{e}</button>
            ))}
          </div>
          <div className="cta"><button className="btn" type="submit">Post Message</button></div>
        </form>
      </div>

      <div className="card" style={{marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin:0}}>Messages</h3>
        <AdminBox />
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {list.map(msg=>(
          <div key={msg.id} className="card" style={{display:'flex', gap:12}}>
            <div style={{width:44, height:44, minWidth:44, borderRadius:'9999px', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>
              {String(msg.name||'?').trim().slice(0,1).toUpperCase()}
            </div>
            <div style={{flex:1}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8}}>
                <div style={{fontWeight:700}}>{msg.name}</div>
                <div className="muted" style={{fontSize:12}}>{timeAgo(msg.created_at)}</div>
              </div>
              <p style={{margin:'8px 0 10px', whiteSpace:'pre-wrap'}}>{msg.text}</p>

              <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
                {EMOJIS.map(e=>(
                  <button key={e} type="button" className="btn" onClick={()=>react(msg.id, e)}>{e} {msg.reactions?.[e]||0}</button>
                ))}
                <button className="btn" style={{marginLeft:'auto'}} onClick={()=>load()}>Refresh</button>
                {admin && <button className="btn danger" onClick={()=>del(msg.id)}>Delete</button>}
              </div>

              <div style={{marginTop:12, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                <strong>Replies</strong>
                <ul style={{marginTop:6, paddingLeft:16}}>
                  {(msg.replies||[]).map(r=>(
                    <li key={r.id} style={{margin:'4px 0'}}><span className="pill" style={{marginRight:6}}>{r.name}</span>{r.text}</li>
                  ))}
                  {(msg.replies||[]).length===0 && <li className="muted">No replies yet</li>}
                </ul>
                <ReplyForm onSubmit={(name,text)=>reply(msg.id,name,text)} />
              </div>
            </div>
          </div>
        ))}
        {list.length===0 && <div className="muted">No messages yet. Be the first to post!</div>}
      </div>
    </section>
  );
}

function ReplyForm({onSubmit}){
  const [name,setName] = useState('');
  const [text,setText] = useState('');
  const [busy,setBusy] = useState(false);
  return (
    <form onSubmit={async (e)=>{ e.preventDefault(); if(!name||!text) return; setBusy(true); await onSubmit(name,text); setBusy(false); setName(''); setText(''); }} style={{marginTop:8}}>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder="Reply…" value={text} onChange={e=>setText(e.target.value)} required style={{flex:1, minWidth:180}} />
        <button className="btn" disabled={busy} type="submit">{busy?'Sending…':'Reply'}</button>
      </div>
      <div className="emoji-row" style={{marginTop:8, display:'flex', gap:8}}>
        {['🎉','❤️','🙌','👍','🏀'].map(e=>(
          <button key={e} type="button" className="btn" onClick={()=>setText(t=>t + e)}>{e}</button>
        ))}
      </div>
    </form>
  );
}
