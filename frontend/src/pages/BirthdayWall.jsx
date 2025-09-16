import { useEffect, useState } from 'react'
import Picker from 'emoji-picker-react'
import { api } from '../lib/api'

function EmojiBar({onPick}){
  const common = ['🎉','🎂','🏀','💜','🔥','👏']
  return (
    <div className="flex gap-2 flex-wrap">
      {common.map(e => (
        <button key={e} onClick={()=>onPick(e)} className="text-2xl hover:scale-110 transition">{e}</button>
      ))}
    </div>
  )
}

export default function BirthdayWall(){
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [items, setItems] = useState([])
  const [admin, setAdmin] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const load = async ()=> setItems(await api.getMessages())
  useEffect(()=>{ load() }, [])

  const post = async (e)=>{
    e.preventDefault()
    await api.addMessage({name, text})
    setName(''); setText('')
    await load()
  }

  const react = async (id, emoji)=>{
    await api.reactMessage(id, emoji)
    await load()
  }

  const remove = async (id)=>{
    if(!admin) { alert('Enter admin password to delete'); return; }
    await api.deleteMessage(id, admin)
    await load()
  }

  return (
    <section className="container-nba py-10">
      <h2 className="text-3xl font-black text-nbaPurple">Birthday Wall</h2>

      <form onSubmit={post} className="card mt-4 grid gap-3 max-w-2xl">
        <input className="bg-white text-black rounded-lg p-3" placeholder="Your name"
          value={name} onChange={e=>setName(e.target.value)} />
        <textarea className="bg-white text-black rounded-lg p-3 min-h-[120px]" placeholder="Write a birthday wish… 🎉"
          value={text} onChange={e=>setText(e.target.value)} />
        <div className="flex items-center justify-between gap-4">
          <EmojiBar onPick={(emo)=>setText(t=> t + emo)} />
          <button type="button" className="link" onClick={()=>setShowPicker(s=>!s)}>
            {showPicker ? 'Hide Emoji Picker' : 'Open Emoji Picker'}
          </button>
        </div>
        {showPicker && <div className="bg-black p-2 rounded-lg border border-zinc-700">
          <Picker onEmojiClick={(e)=>setText(t=>t + e.emoji)} width="100%" theme="dark" />
        </div>}
        <button className="btn self-start" type="submit">Post Message</button>
      </form>

      <div className="card mt-6 max-w-2xl">
        <div className="flex items-center gap-2">
          <div className="font-bold">Admin Password (for deletes):</div>
          <input type="password" className="bg-black border border-zinc-700 rounded-lg p-2"
            placeholder="••••••••" value={admin} onChange={e=>setAdmin(e.target.value)}/>
        </div>
      </div>

      <ul className="mt-6 space-y-3 max-w-2xl">
        {items.map(m => (
          <li key={m.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-nbaPurple">{m.name}</div>
                <div className="text-zinc-200 whitespace-pre-wrap">{m.text}</div>
              </div>
              <button className="text-sm text-red-400 hover:underline" onClick={()=>remove(m.id)}>Delete</button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <EmojiBar onPick={(emo)=>react(m.id, emo)} />
              <div className="text-sm text-zinc-400">
                {m.reactions && Object.entries(m.reactions).map(([k,v]) => <span key={k} className="mr-2">{k} {v}</span>)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
