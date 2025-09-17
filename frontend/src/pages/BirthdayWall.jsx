import { useEffect, useState } from 'react'
import axios from 'axios'
const API = __API_BASE__ || ''
const REACTS = ['👍','❤️','🎉','😂','🙌','👏','🔥','🥳']

export default function BirthdayWall(){
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)

  async function load(){ const res = await axios.get(`${API}/api/messages`); setList(res.data||[]) }
  useEffect(()=>{ load(); const id=setInterval(load, 5000); return ()=>clearInterval(id)},[])

  async function postMessage(e){
    e.preventDefault()
    if(!name || !text) return
    await axios.post(`${API}/api/messages`, { name, text })
    setName(''); setText(''); load()
  }

  async function react(id, emoji){
    await axios.post(`${API}/api/messages/${id}/react`, { emoji })
    load()
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="h2 mb-4">Birthday Wall</h2>
      <form onSubmit={postMessage} className="card space-y-3">
        <div>
          <label className="label">Your Name</label>
          <input className="input w-full" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Message</label>
          <div className="relative">
            <textarea className="input w-full h-32" value={text} onChange={e=>setText(e.target.value)} />
            <button type="button" onClick={()=>setEmojiOpen(v=>!v)} className="absolute right-2 bottom-2 btn px-3 py-1">😀</button>
            {emojiOpen && (
              <div className="absolute right-0 bottom-12 bg-zinc-800 border border-white/10 rounded-xl p-2 grid grid-cols-8 gap-1">
                {REACTS.map(e => <button key={e} type="button" onClick={()=>{setText(t=>t+e); setEmojiOpen(false)}} className="px-2 py-1 hover:bg-zinc-700 rounded">{e}</button>)}
              </div>
            )}
          </div>
        </div>
        <button className="btn w-full">Post Message 🎉</button>
      </form>

      <div className="mt-6 space-y-3">
        {list.map(m => (
          <div key={m.id} className="card">
            <div className="font-semibold">{m.name}</div>
            <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {REACTS.map(e => (
                <button key={e} onClick={()=>react(m.id, e)} className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700">
                  {e} <span className="text-xs text-gray-300">{m.reactions?.[e]||0}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
