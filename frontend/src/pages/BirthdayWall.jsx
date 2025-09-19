import React, { useEffect, useState } from 'react'

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
    <section style={{margin:'28px 0'}}>
      <div className="card" style={{marginBottom:16}}>
        <h2 style={{marginTop:0}}>Birthday Wall 🎉</h2>
        <form onSubmit={post}>
          <label>Your Name</label>
          <input 
            value={form.name} 
            onChange={e=>setForm({...form, name:e.target.value})} 
            required 
          />
          <label>Message</label>
          <textarea 
            value={form.text} 
            onChange={e=>setForm({...form, text:e.target.value})} 
            required 
            placeholder="Type your message, add emojis below…" 
          />
          <div className="emoji-row" style={{marginTop:8}}>
            {EMOJIS.map(e=>(<button key={e} type="button" onClick={()=>setForm({...form, text: form.text + e})}>{e}</button>))}
          </div>
          <div className="cta">
            <button className="btn" type="submit">Post Message</button>
          </div>
        </form>
      </div>

      <div className="card" style={{marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin:0}}>Messages</h3>
        <AdminBox admin={admin} setAdmin={setAdmin} adminPass={adminPass} setAdminPass={setAdminPass} />
      </div>

      <div className="grid">
        {list.map(msg=> (
          <div key={msg.id} className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <strong>{msg.name}</strong>
              {admin && <button className="btn danger" onClick={()=>del(msg.id)}>Delete</button>}
            </div>
            <p style={{margin:'8px 0 10px'}}>{msg.text}</p>
            <div className="emoji-row">
              {EMOJIS.map(e=>(
                <button key={e} type="button" onClick={()=>react(msg.id, e)}>
                  {e} {msg.reactions?.[e]||0}
                </button>
              ))}
            </div>
            <div style={{marginTop:10}}>
              <strong>Replies</strong>
              <ul>
                {(msg.replies||[]).map(r=>(<li key={r.id}><span className="pill">{r.name}</span> {r.text}</li>))}
                {(msg.replies||[]).length===0 && <li className="muted">No replies yet</li>}
              </ul>
              <ReplyForm onSubmit={(name,text)=>reply(msg.id,name,text)} />
            </div>
          </div>
        ))}
        {list.length===0 && <div className="muted">No messages yet. Be the first to post!</div>}
      </div>
    </section>
  )
}

function AdminBox({admin, setAdmin, adminPass, setAdminPass}){
  if(admin) return <div className="pill">Admin mode</div>
  return (
    <div style={{display:'flex', gap:8, alignItems:'center', marginTop:8, width:'100%'}}>
      <form 
        onSubmit={(e)=>{ 
          e.preventDefault(); 
          if(adminPass==='ocie2025') setAdmin(true); 
          else alert('Wrong password'); 
        }} 
        style={{display:'flex', gap:8, flex:1}}
      >
        <input 
          style={{flex:1}} 
          placeholder="Admin password" 
          type="password" 
          value={adminPass} 
          onChange={e=>setAdminPass(e.target.value)} 
        />
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
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
        <button className="btn" type="submit">Reply</button>
      </div>
    </form>
  )
}
