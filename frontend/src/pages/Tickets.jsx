import { useState, useEffect } from 'react'

export default function Tickets(){
  const [name, setName] = useState('')
  const [qty, setQty] = useState(1)
  const [msg, setMsg] = useState('')
  const [list, setList] = useState([])
  useEffect(()=>{ fetch('/api/tickets').then(r=>r.json()).then(setList) },[])
  async function submit(e){
    e.preventDefault()
    const r = await fetch('/api/tickets',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, quantity:qty})})
    const j = await r.json(); setMsg(j.message||'Submitted'); setName(''); setQty(1)
    setList(await (await fetch('/api/tickets')).json())
  }
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="text-xl font-bold text-purple-400 mb-3">Get Tickets</h3>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2 rounded text-black" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)}/>
          <input className="w-full p-2 rounded text-black" type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))}/>
          <button className="btn">Request</button>
        </form>
        {msg && <p className="text-green-400 mt-3">{msg}</p>}
      </div>
      <div className="card">
        <h4 className="font-semibold text-purple-300 mb-2">Requests</h4>
        <ul className="space-y-2 text-sm">
          {list.map(t=>(<li key={t.id} className="flex justify-between"><span>{t.name}</span><span className="text-zinc-300">x{t.quantity}</span></li>))}
        </ul>
        <div className="mt-3 text-zinc-300 text-sm">Total tickets requested: <strong>{list.reduce((a,b)=>a+(b.quantity||0),0)}</strong></div>
      </div>
    </div>
  )
}
