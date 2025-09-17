import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

const ADMIN_PASS = 'ocie2025'
const dataDir = path.join(__dirname, 'data')
const file = (name) => path.join(dataDir, name)

async function readJSON(name, fallback){
  try { const t = await fs.readFile(file(name),'utf8'); return JSON.parse(t) }
  catch { return fallback }
}
async function writeJSON(name, val){
  await fs.mkdir(dataDir, {recursive:true})
  await fs.writeFile(file(name), JSON.stringify(val, null, 2))
}

// Clean, production defaults (no sample data)
const empty = {
  players: [],
  shooting: [],
  teams: { A: [], B: [] },
  tickets: [],
  messages: []
}

app.get('/api/health', (_req,res)=>res.json({ok:true}))

// Registration
app.post('/api/register', async (req,res)=>{
  const { name, age, shooting, team } = req.body || {}
  if(!name) return res.status(400).json({message:'Name required'})
  const players = await readJSON('players.json', empty.players)
  const id = Date.now()
  const player = { id, name, age, shooting: !!shooting, team: !!team }
  players.push(player)
  await writeJSON('players.json', players)
  if(shooting){
    const shootingList = await readJSON('shooting.json', empty.shooting)
    shootingList.push({ id, name, score: 0, time:'00:00' })
    await writeJSON('shooting.json', shootingList)
  }
  res.json({message:'Registered!', player})
})

app.get('/api/players', async (_req,res)=>{
  const players = await readJSON('players.json', empty.players)
  res.json(players)
})

// Shooting
app.get('/api/shooting', async (_req,res)=>{
  const list = await readJSON('shooting.json', empty.shooting)
  const sorted = [...list].sort((a,b)=> (b.score||0)-(a.score||0) || (a.time||'99:99').localeCompare(b.time||'99:99'))
  res.json(sorted)
})

app.patch('/api/shooting/:id', async (req,res)=>{
  const id = Number(req.params.id)
  const { score, time } = req.body || {}
  let list = await readJSON('shooting.json', empty.shooting)
  list = list.map(p => p.id===id ? {...p, score, time} : p)
  await writeJSON('shooting.json', list)
  res.json({ok:true})
})

// Teams
app.get('/api/teams', async (_req,res)=>{
  const teams = await readJSON('teams.json', empty.teams)
  res.json(teams)
})
app.post('/api/teams/auto', async (req,res)=>{
  if(req.headers['x-admin-pass'] !== ADMIN_PASS) return res.status(401).json({message:'Unauthorized'})
  const players = await readJSON('players.json', empty.players)
  const teamPlayers = players.filter(p => p.team)
  const A = [], B = []
  teamPlayers.forEach((p,i)=> (i%2===0? A:B).push({id:p.id, name:p.name}))
  await writeJSON('teams.json', {A,B})
  res.json({A,B})
})

// Tickets
app.get('/api/tickets', async (_req,res)=>{
  const t = await readJSON('tickets.json', empty.tickets); res.json(t)
})
app.post('/api/tickets', async (req,res)=>{
  const { name, quantity } = req.body || {}
  if(!name) return res.status(400).json({message:'Name required'})
  const t = await readJSON('tickets.json', empty.tickets)
  t.push({ id: Date.now(), name, quantity: Number(quantity||1) })
  await writeJSON('tickets.json', t)
  res.json({message:'Thank you! Your tickets will be available at the Box Office.'})
})

// Messages
app.get('/api/messages', async (_req,res)=>{
  const m = await readJSON('messages.json', empty.messages); res.json(m)
})
app.post('/api/messages', async (req,res)=>{
  const { name, text } = req.body || {}
  if(!name || !text) return res.status(400).json({message:'Name and text required'})
  const m = await readJSON('messages.json', empty.messages)
  m.push({ id: Date.now(), name, text, reactions: {} })
  await writeJSON('messages.json', m)
  res.json({ok:true})
})
app.post('/api/messages/:id/react', async (req,res)=>{
  const id = Number(req.params.id)
  const { emoji } = req.body || {}
  const m = await readJSON('messages.json', empty.messages)
  const out = m.map(msg => msg.id===id ? {...msg, reactions: {...msg.reactions, [emoji]: (msg.reactions?.[emoji]||0)+1 }} : msg)
  await writeJSON('messages.json', out)
  res.json({ok:true})
})
app.delete('/api/messages/:id', async (req,res)=>{
  if(req.headers['x-admin-pass'] !== ADMIN_PASS) return res.status(401).json({message:'Unauthorized'})
  const id = Number(req.params.id)
  const m = await readJSON('messages.json', empty.messages)
  await writeJSON('messages.json', m.filter(x=>x.id!==id))
  res.json({ok:true})
})

// Reset everything to clean (no sample data)
app.post('/api/reset', async (req,res)=>{
  if(req.headers['x-admin-pass'] !== ADMIN_PASS) return res.status(401).json({message:'Unauthorized'})
  await writeJSON('players.json', empty.players)
  await writeJSON('shooting.json', empty.shooting)
  await writeJSON('tickets.json', empty.tickets)
  await writeJSON('messages.json', empty.messages)
  await writeJSON('teams.json', empty.teams)
  res.json({ok:true})
})

// Serve built frontend if exists (for Docker all-in-one)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')))
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
