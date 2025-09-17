import { useEffect, useState } from 'react'
import { api, setAdmin } from '../lib/api'

const EMOJIS = ['🎉','👍','❤️','🔥','👏']

export default function BirthdayWall(){
  const [items,setItems] = useState([])
  const [name,setName] = useState('')
  const [text,setText] = useState('')
  const [adminPass,setAdminPass] = useState('')
  const [replyText,setReplyText] = useState({}) // id -> text
  const [replyName,setReplyName] = useState({}) // id -> name

  async function load(){
    setItems(await api('/messages'))
  }
  useEffect(()=>{ load(); const t=setInterval(load,4000); return ()=>clearInterval(t) },[])

  async function post(e){
    e.preventDefault()
    await api('/messages',{method:'POST', body:JSON.stringify({name, text})})
    setName(''); setText(''); load()
  }

  async function react(id, emoji){
    await api(`/messages/${id}/react`, {method:'POST', body:JSON.stringify({emoji})})
    load()
  }

  async function del(id){
    await api(`/messages/${id}`, {method:'DELETE', headers: setAdmin(adminPass)})
    load()
  }

  async function reply(id){
    const rname = replyName[id] || 'Guest'
    const rtext = replyText[id]
    if(!rtext) return
    await api(`/messages/${id}/reply`, {method:'POST', body:JSON.stringify({name:rname, text:rtext})})
    setReplyText({...replyText, [id]: ''})
    load()
  }

  return (
    <div className="space-y-6">
      <div className="card max-w-2xl">
        <h2 className="text-primary mb-3">Send a Birthday Wish</h2>
        <form onSubmit={post} className="space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" required className="w-full px-3 py-2 rounded bg-white text-black" />
          <div className="space-y-2">
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write your message..." required className="w-full px-3 py-2 rounded bg-white text-black h-28" />
            <div className="flex gap-2">
              {EMOJIS.map(e=> <button key={e} type="button" className="px-2 py-1 rounded bg-white/10" onClick={()=>setText((t)=> (t? t+' '+e : e))}>{e}</button>)}
            </div>
          </div>
          <button className="btn">Post Message</button>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-primary">Birthday Wall</h2>
          <div className="flex items-center gap-2">
            <input type="password" placeholder="Admin password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} className="px-3 py-2 rounded bg-white/5 border border-white/10" />
          </div>
        </div>
        <ul className="space-y-4">
          {items.map(m => (
            <li key={m.id} className="border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">{m.name}</div>
                  <div className="text-white/90 whitespace-pre-wrap">{m.text}</div>
                </div>
                <div className="flex gap-2 items-center">
                  {EMOJIS.map(e => (
                    <button key={e} className="px-2 py-1 rounded bg-white/10" onClick={()=>react(m.id, e)}>{e} {m.reactions?.[e]||0}</button>
                  ))}
                  {adminPass && <button onClick={()=>del(m.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>}
                </div>
              </div>

              <div className="mt-3 pl-4 border-l border-white/10 space-y-2">
                {(m.replies||[]).map(r => (
                  <div key={r.id} className="text-white/80"><span className="font-semibold">{r.name}:</span> {r.text}</div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={replyName[m.id]||''}
                    onChange={e=>setReplyName({...replyName,[m.id]:e.target.value})}
                    placeholder="Your name"
                    className="px-2 py-1 rounded bg-white/5 border border-white/10"
                  />
                  <input
                    value={replyText[m.id]||''}
                    onChange={e=>setReplyText({...replyText,[m.id]:e.target.value})}
                    placeholder="Reply..."
                    className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10"
                  />
                  <button onClick={()=>reply(m.id)} className="btn">Reply</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
