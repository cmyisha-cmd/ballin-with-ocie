import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export default function Tickets(){
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [thanks, setThanks] = useState('')
  const [list, setList] = useState([])

  const load = async ()=> setList(await api.getTickets())
  useEffect(()=>{ load() }, [])

  const submit = async (e)=>{
    e.preventDefault()
    setThanks('')
    try{
      const r = await api.addTickets({name, quantity})
      setThanks(r.message)
      setName(''); setQuantity(1)
      await load()
    }catch(e){ setThanks(e.message) }
  }

  const total = list.reduce((s,x)=>s + Number(x.quantity||0), 0)

  return (
    <section className="container-nba py-10">
      <h2 className="text-3xl font-black text-nbaPurple">Get Tickets</h2>
      <form onSubmit={submit} className="card mt-4 grid gap-4 max-w-xl">
        <input className="bg-black border border-zinc-700 rounded-lg p-3" placeholder="Your name"
          value={name} onChange={e=>setName(e.target.value)}/>
        <input type="number" className="bg-black border border-zinc-700 rounded-lg p-3" min={1} value={quantity}
          onChange={e=>setQuantity(Number(e.target.value))}/>
        <button className="btn" type="submit">Request</button>
        {thanks && <div className="text-sm text-zinc-300">{thanks}</div>}
      </form>

      <div className="card mt-6">
        <div className="font-bold text-nbaPurple">Requests (Total: {total})</div>
        <ul className="mt-3 text-sm text-zinc-300 space-y-1">
          {list.map(x=> <li key={x.id}>{x.name} — {x.quantity}</li>)}
        </ul>
      </div>
    </section>
  )
}
