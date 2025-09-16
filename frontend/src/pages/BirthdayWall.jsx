import { useEffect, useState } from 'react'

const ADMIN_PASS = 'ocie2025'

export default function BirthdayWall(){
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [picker, setPicker] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [pass, setPass] = useState('')

  async function load(){ setMessages(await (await fetch('/api/messages')).json()) }
  useEffect(()=>{ load() },[])

  async function post(){
    if(!name || !text) return
    await fetch('/api/messages',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, text})})
    setName(''); setText(''); load()
  }
  async function react(id, emoji){
    await fetch(`/api/messages/${id}/react`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({emoji})})
    load()
  }
  async function del(id){
    await fetch(`/api/messages/${id}`,{method:'DELETE', headers:{'x-admin-pass': ADMIN_PASS}})
    load()
  }
  function tryLogin(){ if(pass===ADMIN_PASS){ setAdmin(true); setPass('') } }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-bold text-purple-400 mb-3">🎉 Birthday Wall</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input className="p-2 rounded text-black" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)}/>
          <textarea className="p-2 rounded text-black md:col-span-2" placeholder="Type your message" value={text} onChange={e=>setText(e.target.value)} />
          <div className="flex items-center gap-2">
            <button onClick={()=>setPicker(p=>!p)} className="btn">😀 Emoji</button>
            {picker && <div className="flex gap-2">{['🎉','🎂','🏀','🔥','💯'].map(e=>(<button key={e} onClick={()=>setText(t=>t+e)}>{e}</button>))}</div>}
          </div>
          <button onClick={post} className="btn md:col-span-2">Post Message</button>
        </div>
      </div>

      {!admin && (
        <div className="card">
          <h4 className="font-semibold text-purple-300 mb-2">Admin Login</h4>
          <div className="flex gap-2">
            <input type="password" className="p-2 rounded text-black" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)}/>
            <button onClick={tryLogin} className="btn">Login</button>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {messages.map(m=>(
          <li key={m.id} className="card">
            <div className="flex justify-between">
              <p><b>{m.name}</b>: {m.text}</p>
              <div className="flex gap-2">{['🎉','🎂','🏀','🔥','💯'].map(e=>(
                <button key={e} onClick={()=>react(m.id,e)}>{e} {m.reactions?.[e]||0}</button>
              ))}</div>
            </div>
            {admin && <button onClick={()=>del(m.id)} className="mt-2 text-xs text-red-400 underline">Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  )
}
