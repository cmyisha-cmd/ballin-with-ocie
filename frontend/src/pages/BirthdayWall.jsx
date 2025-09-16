import { useEffect, useState } from 'react'
import { getJSON, postJSON, del } from '../api'

const EMOJIS=['👍','❤️','🎉','😂','🙌']

export default function BirthdayWall(){
  const [messages,setMessages]=useState([])
  const [name,setName]=useState('')
  const [text,setText]=useState('')
  const [showPicker,setShowPicker]=useState(false)
  const [admin,setAdmin]=useState(false)
  const [pass,setPass]=useState('')

  useEffect(()=>{ (async()=>{
    const data = await getJSON('/messages'); setMessages(data||[])
  })() }, [])

  async function postMessage(){
    if(!text.trim()) return;
    const msg = await postJSON('/messages',{ name: name||'Guest', text })
    setMessages([msg,...messages]); setText('')
  }
  async function react(id, emoji){
    const res = await postJSON(`/messages/${id}/react`,{ emoji })
    setMessages(messages.map(m=> m.id===id? res : m))
  }
  async function reply(id, replyText){
    if(!replyText.trim()) return;
    const res = await postJSON(`/messages/${id}/reply`,{ text: replyText, name: name || 'Guest' })
    setMessages(messages.map(m=> m.id===id? res : m))
  }
  async function tryAdmin(){
    if(pass==='ocie2025') setAdmin(true)
  }
  async function remove(id){
    const res = await del(`/messages/${id}`, {'x-admin-pass':'ocie2025'})
    if(res?.ok) setMessages(messages.filter(m=>m.id!==id))
  }

  return (
    <div className="container" style={{padding:'2rem 1rem'}}>
      <div className="card" style={{background:'linear-gradient(180deg,#1b0037,#0a0a0a)', marginBottom:'1rem'}}>
        <h2>🎂 Birthday Wall</h2>
        <p className="kicker">Leave a wish for Ocie — add emojis and replies!</p>
        {!admin && (
          <div className="row">
            <input className="input col" type="password" placeholder="Admin password" value={pass} onChange={e=>setPass(e.target.value)} />
            <button className="btn" onClick={tryAdmin}>Admin Login</button>
          </div>
        )}
      </div>

      <div className="card grid" style={{maxWidth:760, margin:'0 auto 1rem'}}>
        <input className="input" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} />
        <textarea className="textarea" placeholder="Write your birthday message..." value={text} onChange={e=>setText(e.target.value)} />
        <div className="row">
          <button className="btn secondary" onClick={()=>setShowPicker(!showPicker)}>😀 Emoji</button>
          <button className="btn" onClick={postMessage}>Post Message</button>
        </div>
        {showPicker && (
          <div className="row" style={{flexWrap:'wrap'}}>
            {EMOJIS.map(e=>(<button key={e} className="reactions" onClick={()=>setText(t=>t+e)}>{e}</button>))}
          </div>
        )}
      </div>

      <div className="grid" style={{maxWidth:900, margin:'0 auto'}}>
        {messages.map(m=> <Message key={m.id} m={m} onReact={react} onReply={reply} onDelete={remove} isAdmin={admin} />)}
      </div>
    </div>
  )
}

function Message({m,onReact,onReply,onDelete,isAdmin}){
  const [replyText,setReplyText]=useState('')
  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div className="flex"><b style={{color:'var(--purple)'}}>{m.name}</b><span className="tag">#{m.id}</span></div>
        {isAdmin && <button className="btn secondary" onClick={()=>onDelete(m.id)}>🗑 Remove</button>}
      </div>
      <p style={{margin:'.4rem 0 1rem'}}>{m.text}</p>
      <div className="reactions row" style={{alignItems:'center'}}>
        {EMOJIS.map(e=>(
          <button key={e} onClick={()=>onReact(m.id,e)}>{e} <span className="small">{m.reactions?.[e]||''}</span></button>
        ))}
      </div>
      <div className="row" style={{marginTop:'.6rem'}}>
        <input className="input col" placeholder="Write a reply..." value={replyText} onChange={e=>setReplyText(e.target.value)} />
        <button className="btn" onClick={()=>{ onReply(m.id, replyText); setReplyText(''); }}>Reply</button>
      </div>
      {m.replies?.length>0 && (
        <div style={{marginTop:'.6rem'}}>
          <div className="small">Replies</div>
          <div className="grid">
            {m.replies.map((r,i)=>(<div key={i} className="card" style={{background:'#0f0f0f'}}><b>{r.name}:</b> {r.text}</div>))}
          </div>
        </div>
      )}
    </div>
  )
}
