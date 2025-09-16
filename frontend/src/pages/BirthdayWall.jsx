import React, { useEffect, useState } from 'react'
import api from '../lib/api'

const EMOJIS = ['🎉','👍','❤️','👏','🔥']

export default function BirthdayWall(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name:'', text:'' })
  const [admin, setAdmin] = useState(false)
  const [pass, setPass] = useState('')

  const load = async ()=>{
    const res = await api.get('/api/messages'); setList(res.data || [])
  }
  useEffect(()=>{ load(); }, [])

  const submit = async (e)=>{
    e.preventDefault()
    await api.post('/api/messages', form)
    setForm({ name:'', text:'' })
    load()
  }
  const react = async (id, emoji)=>{
    await api.post(`/api/messages/${id}/react`, { emoji })
    load()
  }
  const del = async (id)=>{
    await api.delete(`/api/messages/${id}`, { headers: {'x-admin-pass': pass} })
    load()
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-purple-400">Birthday Wall</h3>
        {!admin ? (
          <form onSubmit={(e)=>{e.preventDefault(); setAdmin(true)}} className="flex items-center gap-2">
            <input type="password" placeholder="Admin password" className="bg-neutral-900 border border-neutral-700 rounded px-3 py-1 text-sm" value={pass} onChange={e=>setPass(e.target.value)} />
            <button className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm">Login</button>
          </form>
        ) : (
          <div className="text-xs text-neutral-400">Admin Mode</div>
        )}
      </div>

      <form onSubmit={submit} className="bg-neutral-900/60 border border-neutral-700 rounded p-4 space-y-3 mb-6">
        <input className="w-full bg-white/95 text-black rounded px-3 py-2" placeholder="Your name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        <div className="flex items-center gap-2">
          <textarea className="flex-1 bg-white text-black rounded px-3 py-2" placeholder="Type a birthday wish..." value={form.text} onChange={e=>setForm({...form, text:e.target.value})} required/>
          <div className="flex gap-1">
            {EMOJIS.map(e => <button key={e} type="button" className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700" onClick={()=>setForm({...form, text: form.text + ' ' + e})}>{e}</button>)}
          </div>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded font-semibold">Post</button>
      </form>

      <ul className="space-y-3">
        {list.map(m=>(
          <li key={m.id} className="bg-neutral-900/60 border border-neutral-700 rounded p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{m.name}</div>
              {admin && <button onClick={()=>del(m.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>}
            </div>
            <p className="text-neutral-200 mt-1">{m.text}</p>
            <div className="flex items-center gap-2 mt-2">
              {EMOJIS.map(e => (
                <button key={e} onClick={()=>react(m.id, e)} className="text-xl">{e}</button>
              ))}
              <div className="text-xs text-neutral-400 ml-2">
                {m.reactions && Object.keys(m.reactions).length>0 ? (
                  Object.entries(m.reactions).map(([k,v])=> <span key={k} className="mr-2">{k} {v}</span> )
                ) : <span>No reactions yet</span>}
              </div>
            </div>
          </li>
        ))}
        {list.length===0 && <li className="text-neutral-400 text-sm">No messages yet.</li>}
      </ul>
    </section>
  )
}
