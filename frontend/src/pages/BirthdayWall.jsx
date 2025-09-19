import React, { useEffect, useState } from 'react'
import '../birthdaywall.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com'
const EMOJIS = ['🎉','🎂','🏀','🔥','👍','❤️','🙌']

export default function BirthdayWall(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name:'', text:'' })
  const [admin, setAdmin] = useState(false)
  const [adminPass, setAdminPass] = useState('')

  async function load(){ 
    try{ 
      const r = await fetch(`${API_URL}/api/messages`) 
      setList(await r.json()) 
    }catch(e){ console.error('Load failed', e) } 
  }
  useEffect(()=>{ load(); const t=setInterval(load, 5000); return ()=>clearInterval(t) }, [])

  async function post(e){
    e.preventDefault()
    if(!form.name || !form.text) return
    await fetch(`${API_URL}/api/messages`, { 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify(form) 
    })
    setForm({ name:'', text:'' })
    load()
  }
  async function react(id, emoji){
    await fetch(`${API_URL}/api/messages/${id}/react`, { 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({emoji}) 
    })
    load()
  }
  async function reply(id, name, text){
    if(!name || !text) return
    await fetch(`${API_URL}/api/messages/${id}/reply`, { 
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify({name, text}) 
    })
    load()
  }
  async function del(id){
    if(!admin) return
    await fetch(`${API_URL}/api/messages/${id}`, { 
      method:'DELETE', 
      headers:{ 'x-admin-pass': 'ocie2025' } 
    })
    load()
  }

  return (
    <section className="birthday-wall">
      <header className="wall-header">
        <h2>Birthday Wall 🎉</h2>
        <p className="muted">Leave a message for Ocie’s 13th!</p>
      </header>

      {/* Post Form */}
      <div className="post-form card">
        <form onSubmit={post}>
          <input 
            placeholder="Your Name" 
            value={form.name} 
            onChange={e=>setForm({...form, name:e.target.value})} 
            required 
          />
          <textarea 
            placeholder="Write your birthday message…" 
            value={form.text} 
            onChange={e=>setForm({...form, text:e.target.value})} 
            required 
          />
          <div className="emoji-row">
            {EMOJIS.map(e=>(
              <button key={e} type="button" onClick={()=>setForm({...form, text: form.text + e})}>
                {e}
              </button>
            ))}
          </div>
          <div className="cta">
            <button className="btn" type="submit">📩 Post</button>
          </div>
        </form>
      </div>

      {/* Messages */}
      <div className="messages">
        {list.map(msg=> (
          <div key={msg.id} className="message-card">
            <div className="message-header">
              <strong>{msg.name}</strong>
              {admin && <button className="btn danger" onClick={()=>del(msg.id)}>🗑 Delete</button>}
            </div>
            <p className="message-text">{msg.text}</p>
            <div className="emoji-row">
              {EMOJIS.map(e=>(
                <button key={e} type="button" onClick={()=>react(msg.id, e)}>
                  {e} <span className="count">{msg.reactions?.[e]||0}</span>
                </button>
              ))}
            </div>
            <div className="replies">
              <strong>Replies</strong>
              <ul>
                {(msg.replies||[]).map(r=>(<li key={r.id} className="reply"><span className="pill">{r.name}</span> {r.text}</li>))}
                {(msg.replies||[]).length===0 && <li className="muted">No replies yet</li>}
              </ul>
              <ReplyForm onSubmit={(name,text)=>reply(msg.id,name,text)} />
            </div>
          </div>
        ))}
        {list.length===0 && <div className="muted">No messages yet. Be the first to post!</div>}
      </div>

      {/* Admin box at bottom */}
      <div className="admin-box">
        <AdminBox admin={admin} setAdmin={setAdmin} adminPass={adminPass} setAdminPass={setAdminPass} />
      </div>
    </section>
  )
}

function AdminBox({admin, setAdmin, adminPass, setAdminPass}){
  if(admin) return <div className="pill">Admin mode</div>
  return (
    <form 
      onSubmit={(e)=>{ 
        e.preventDefault(); 
        if(adminPass==='ocie2025') setAdmin(true); 
        else alert('Wrong password'); 
      }} 
      style={{display:'flex', gap:8, marginTop:16}}
    >
      <input 
        placeholder="Admin password" 
        type="password" 
        value={adminPass} 
        onChange={e=>setAdminPass(e.target.value)} 
      />
      <button className="btn" type="submit">Login</button>
    </form>
  )
}

function ReplyForm({onSubmit}){
  const [name,setName] = React.useState('')
  const [text,setText] = React.useState('')
  return (
    <form 
      onSubmit={(e)=>{
        e.preventDefault(); 
        if(name && text){ 
          onSubmit(name,text); 
          setName(''); 
          setText(''); 
        }
      }} 
      style={{marginTop:8}}
    >
      <div className="grid">
        <input 
          placeholder="Your name" 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          required 
        />
        <input 
          placeholder="Reply…" 
          value={text} 
          onChange={e=>setText(e.target.value)} 
          required 
        />
      </div>
      <div className="emoji-row" style={{marginTop:8}}>
        {['🎉','❤️','🙌','👍','🏀'].map(e=>(<button key={e} type="button" onClick={()=>setText(text + e)}>{e}</button>))}
      </div>
      <div className="cta">
        <button className="btn" type="submit">↩ Reply</button>
      </div>
    </form>
  )
}
