import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

const ADMIN_PASS = 'ocie2025'

// ----- Sample Data (hardcoded Option A) -----
let players = [
  { id:1, name:'Ocie', age:28, shooting:true, team:true, score:18, time:'01:05' },
  { id:2, name:'Kayla', age:26, shooting:true, team:true, score:16, time:'01:12' },
  { id:3, name:'Shon', age:23, shooting:true, team:false, score:12, time:'01:30' },
  { id:4, name:'Jordan', age:21, shooting:false, team:true }
]
let tickets = [
  { id:1, name:'Marcus Hill', count:3 },
  { id:2, name:'R. Carter', count:2 }
]
let messages = [
  { id:1, name:'Coach T', text:'Happy Birthday Ocie! Keep shining! 🎉', reactions:{'🎉':3,'❤️':1}, replies:[{name:'Ocie', text:'Thank you Coach! 🙏'}] },
  { id:2, name:'Avery', text:'Have an amazing day! 🏀', reactions:{'👍':2}, replies:[] }
]
let teams = []

// Utils
function parseTimeToSecs(t){
  if(!t) return null
  const [m,s] = t.split(':').map(x=>parseInt(x,10))
  if(Number.isNaN(m)||Number.isNaN(s)) return null
  return m*60 + s
}
function formatSecs(secs){
  const m = Math.floor(secs/60); const s = secs%60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

// ----- API -----

// Registration
app.post('/api/register-player', (req,res)=>{
  const { name, age, shooting, team } = req.body||{}
  const id = players.length? Math.max(...players.map(p=>p.id))+1 : 1
  players.push({ id, name, age, shooting:!!shooting, team:!!team })
  res.json({ ok:true, message:'Registered', id })
})

app.get('/api/players', (req,res)=> res.json(players))

// Tickets
app.get('/api/tickets', (req,res)=> res.json(tickets))
app.post('/api/tickets', (req,res)=>{
  const { name, count } = req.body||{}
  const id = tickets.length? Math.max(...tickets.map(t=>t.id))+1 : 1
  tickets.push({ id, name, count:Number(count)||0 })
  res.json({ ok:true, id })
})

// Messages
app.get('/api/messages', (req,res)=> res.json(messages))
app.post('/api/messages', (req,res)=>{
  const { name='Guest', text } = req.body||{}
  const id = messages.length? Math.max(...messages.map(m=>m.id))+1 : 1
  const msg = { id, name, text, reactions:{}, replies:[] }
  messages = [msg, ...messages]
  res.json(msg)
})
app.post('/api/messages/:id/react', (req,res)=>{
  const id = Number(req.params.id); const { emoji } = req.body||{}
  const m = messages.find(x=>x.id===id); if(!m) return res.status(404).json({error:'not found'})
  m.reactions = m.reactions || {}
  m.reactions[emoji] = (m.reactions[emoji]||0)+1
  res.json(m)
})
app.post('/api/messages/:id/reply', (req,res)=>{
  const id = Number(req.params.id); const { text, name='Guest' } = req.body||{}
  const m = messages.find(x=>x.id===id); if(!m) return res.status(404).json({error:'not found'})
  m.replies = m.replies || []
  m.replies.push({ name, text })
  res.json(m)
})
app.delete('/api/messages/:id', (req,res)=>{
  if(req.header('x-admin-pass')!==ADMIN_PASS) return res.status(401).json({error:'unauthorized'})
  const id = Number(req.params.id)
  messages = messages.filter(m=>m.id!==id)
  res.json({ ok:true })
})

// Shooting scores
app.post('/api/shooting/update',(req,res)=>{
  const { id, score, time } = req.body||{}
  const p = players.find(pl=>pl.id===id)
  if(!p) return res.status(404).json({error:'player not found'})
  p.score = Number(score)
  // normalize time to MM:SS
  let secs = parseTimeToSecs(time)
  if(secs===null){ p.time=null } else { p.time = formatSecs(secs) }
  res.json({ ok:true, players })
})

app.get('/api/leaderboard', (req,res)=>{
  const list = players.filter(p=>p.shooting).map(p=>({
    id:p.id, name:p.name, score:p.score??null, time:p.time??null, secs: parseTimeToSecs(p.time)
  }))
  list.sort((a,b)=>{
    const sa = a.score ?? -Infinity; const sb = b.score ?? -Infinity
    if(sb!==sa) return sb-sa
    const ta = (a.secs ?? Infinity); const tb = (b.secs ?? Infinity)
    return ta - tb
  })
  res.json({ leaderboard: list.map(({secs,...rest})=>rest), count: players.filter(p=>p.shooting).length })
})

// Teams auto-assign
app.post('/api/teams/autoassign',(req,res)=>{
  const auth = req.header('x-admin-pass')===ADMIN_PASS
  if(!auth) return res.status(401).json({error:'unauthorized'})
  const candidates = players.filter(p=>p.team)
  const t1 = { name:'Team Purple', players:[] }
  const t2 = { name:'Team Black', players:[] }
  candidates.forEach((p,i)=> (i%2===0 ? t1.players : t2.players).push(p))
  teams = [t1,t2]
  res.json({ ok:true, teams })
})
app.get('/api/teams',(req,res)=> res.json(teams))

// Reset samples
app.post('/api/reset',(req,res)=>{
  if(req.header('x-admin-pass')!==ADMIN_PASS) return res.status(401).json({error:'unauthorized'})
  players = [
    { id:1, name:'Ocie', age:28, shooting:true, team:true, score:18, time:'01:05' },
    { id:2, name:'Kayla', age:26, shooting:true, team:true, score:16, time:'01:12' },
    { id:3, name:'Shon', age:23, shooting:true, team:false, score:12, time:'01:30' },
    { id:4, name:'Jordan', age:21, shooting:false, team:true }
  ]
  tickets = [
    { id:1, name:'Marcus Hill', count:3 },
    { id:2, name:'R. Carter', count:2 }
  ]
  messages = [
    { id:1, name:'Coach T', text:'Happy Birthday Ocie! Keep shining! 🎉', reactions:{'🎉':3,'❤️':1}, replies:[{name:'Ocie', text:'Thank you Coach! 🙏'}] },
    { id:2, name:'Avery', text:'Have an amazing day! 🏀', reactions:{'👍':2}, replies:[] }
  ]
  teams = []
  res.json({ ok:true, players, tickets, messages, teams })
})

// ---- Static hosting (for single Render service) ----
const dist = path.join(__dirname, '..', 'frontend', 'dist')
app.use(express.static(dist))
app.get('*', (req,res)=> res.sendFile(path.join(dist,'index.html')))

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log('Server running on', PORT))
