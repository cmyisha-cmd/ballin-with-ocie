import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'

const EMOJIS = ['🎉','🎂','👍','🔥','👏','❤️']

export default function BirthdayWall(){
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [admin, setAdmin] = useState('')
  const [error, setError] = useState('')

  async function load(){ try{ setMessages(await api('/messages')) }catch(e){ setError(e.message) } }
  useEffect(()=>{ load() }, [])

  async function submit(e){
    e.preventDefault(); setError('')
    try{
      await api('/messages', {method:'POST', body: JSON.stringify({name: name.trim(), text: text.trim()})})
      setName(''); setText(''); await load()
    }catch(e){ setError(e.message) }
  }
  async function react(id, emoji){
    try{ await api(`/messages/${id}/react`, {method:'POST', body: JSON.stringify({emoji})}); await load() }catch(e){}
  }
  async function del(id){
    try{ await api(`/messages/${id}`, {method:'DELETE', headers:{'x-admin-pass': admin}}); await load() }catch(e){ setError('Wrong password or delete failed') }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Birthday Wall</h2>
        {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label>Your Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required />
          </div>
          <div>
            <label>Message</label>
            <div className="space-y-2">
              <textarea rows="3" value={text} onChange={e=>setText(e.target.value)} placeholder="Write a birthday wish…" required />
              <div className="flex gap-2">
                {EMOJIS.map(e=> (
                  <button type="button" key={e} className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700" onClick={()=>setText(t=> (t ? t+' '+e : e))}>{e}</button>
                ))}
              </div>
            </div>
          </div>
          <button className="btn w-full">Post Message</button>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">Messages</h3>
          <div className="flex items-center gap-2">
            <input className="w-40" type="password" placeholder="Admin password" value={admin} onChange={e=>setAdmin(e.target.value)} />
          </div>
        </div>
        <div className="space-y-4">
          {messages.length===0 && <div className="text-zinc-400">No messages yet. Be the first!</div>}
          {messages.map(m => (
            <div key={m.id} className="p-4 rounded-xl border border-white/10 bg-black/40">
              <div className="flex items-center justify-between">
                <strong>{m.name}</strong>
                <div className="flex items-center gap-2 text-sm">
                  {Object.entries(m.reactions||{}).map(([k,v])=> <span key={k} className="px-2 py-0.5 rounded bg-zinc-800">{k} {v}</span>)}
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{m.text}</p>
              <div className="mt-3 flex items-center gap-2">
                {EMOJIS.map(e => <button key={e} onClick={()=>react(m.id, e)} className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700">{e}</button>)}
                <button onClick={()=>del(m.id)} className="ml-auto text-xs text-red-300 hover:text-red-200">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
