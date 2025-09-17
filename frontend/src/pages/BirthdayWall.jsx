
import { useEffect, useState } from 'react'
const API = '/api'
const EMOJIS = ['🎉','🎂','👏','🔥','💜']

export default function BirthdayWall(){
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [admin, setAdmin] = useState(false)
  const [pass, setPass] = useState('')
  const [replyFor, setReplyFor] = useState(null)
  const [replyText, setReplyText] = useState('')

  async function load(){
    const r = await fetch(`${API}/messages`)
    const j = await r.json().catch(()=>[])
    setList(j)
  }
  useEffect(()=>{ load() }, [])

  async function postMsg(e){
    e.preventDefault()
    const r = await fetch(`${API}/messages`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name: name.trim(), text: text.trim() })
    })
    if(r.ok){ setName(''); setText(''); load() }
  }

  async function react(id, emoji){
    await fetch(`${API}/messages/${id}/react`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ emoji })
    })
    load()
  }

  async function reply(id){
    if(!replyText.trim()) return
    await fetch(`${API}/messages/${id}/reply`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name: 'Guest', text: replyText.trim() })
    })
    setReplyFor(null); setReplyText('')
    load()
  }

  async function del(id){
    if(!admin) return
    await fetch(`${API}/messages/${id}`, { method:'DELETE', headers:{'x-admin-pass': pass} })
    load()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="h2">Birthday Wall</h2>
        <div className="flex items-center gap-2">
          {!admin ? (
            <form onSubmit={e=>{e.preventDefault(); setAdmin(true)}} className="flex gap-2">
              <input className="field" placeholder="Admin password" value={pass} onChange={e=>setPass(e.target.value)} type="password" />
              <button className="btn">Login</button>
            </form>
          ): <span className="text-xs text-white/60">Admin mode</span>}
        </div>
      </div>

      <form onSubmit={postMsg} className="card p-6 space-y-4 mb-8">
        <div>
          <label className="label">Your Name</label>
          <input className="field w-full" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea className="field w-full bg-white text-black" rows="3" value={text} onChange={e=>setText(e.target.value)} required />
          <div className="flex gap-2 mt-2">
            {EMOJIS.map(e => <button type="button" key={e} className="px-2 py-1 rounded bg-black/40 border border-white/10" onClick={()=>setText(t=> (t+' '+e).trim())}>{e}</button>)}
          </div>
        </div>
        <button className="btn w-full">Post Message</button>
      </form>

      <div className="space-y-4">
        {list.map(m => (
          <div key={m.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-white/80 mt-1">{m.text}</div>
              </div>
              <div className="flex items-center gap-2">
                {EMOJIS.map(e => (
                  <button key={e} className="px-2 py-1 rounded bg-black/40 border border-white/10" onClick={()=>react(m.id, e)}>
                    {e} <span className="text-xs text-white/60">{m.reactions?.[e]||0}</span>
                  </button>
                ))}
                {admin && <button className="btn" onClick={()=>del(m.id)}>Delete</button>}
              </div>
            </div>

            <div className="mt-3 pl-3 border-l border-white/10 space-y-2">
              {(m.replies||[]).map((r,i)=>(
                <div key={i} className="text-sm"><span className="font-semibold">{r.name}: </span>{r.text}</div>
              ))}
            </div>

            <div className="mt-3">
              {replyFor===m.id ? (
                <div className="flex gap-2">
                  <input className="field flex-1" placeholder="Reply..." value={replyText} onChange={e=>setReplyText(e.target.value)} />
                  <button className="btn" onClick={()=>reply(m.id)}>Send</button>
                  <button className="btn" onClick={()=>setReplyFor(null)}>Cancel</button>
                </div>
              ) : (
                <button className="btn" onClick={()=>setReplyFor(m.id)}>Reply</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
