import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const DATA_PATH = path.join(__dirname, 'data.json')
const readData = () => JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
const writeData = (d) => fs.writeFileSync(DATA_PATH, JSON.stringify(d, null, 2))

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'ballin-with-ocie' }))

// Players
app.get('/api/players', (_req, res) => res.json(readData().players))

app.post('/api/players', (req, res) => {
  const { name, age, event } = req.body || {}
  if (!name || !event) return res.status(400).json({ error: 'name + event required' })
  const data = readData()
  const id = Date.now()
  data.players.push({ id, name, age: Number(age)||0, event, score: 0, time: 0 })
  writeData(data)
  res.json({ success: true, id })
})

// Scores
app.post('/api/scores', (req, res) => {
  const { playerId, score, time } = req.body || {}
  const data = readData()
  const p = data.players.find(x => x.id === Number(playerId))
  if (!p) return res.status(404).json({ error: 'player not found' })
  p.score = Number(score)||0
  p.time = Number(time)||0
  writeData(data)
  res.json({ success: true })
})

app.get('/api/leaderboard', (_req, res) => {
  const list = readData().players
    .filter(p => p.event === 'Shooting Contest')
    .sort((a,b) => (b.score - a.score) || (a.time - b.time))
  res.json(list)
})

// Tickets
app.get('/api/tickets', (_req, res) => res.json(readData().tickets))

app.post('/api/tickets', (req, res) => {
  const { name, count } = req.body || {}
  if (!name || count == null) return res.status(400).json({ error:'name + count required' })
  const data = readData()
  const id = Date.now()
  data.tickets.push({ id, name, count: Number(count)||0 })
  writeData(data)
  res.json({ success: true, id })
})

// Messages
app.get('/api/messages', (_req, res) => res.json(readData().messages))

app.post('/api/messages', (req, res) => {
  const { name, message } = req.body || {}
  if (!name || !message) return res.status(400).json({ error:'name + message required' })
  const data = readData()
  const id = Date.now()
  data.messages.push({ id, name, message })
  writeData(data)
  res.json({ success: true, id })
})

// Teams
app.get('/api/teams', (_req, res) => res.json(readData().teams))

app.post('/api/teams/auto-assign', (_req, res) => {
  const data = readData()
  const playerIds = data.players.filter(p => p.event === 'Team Tournament').map(p => p.id)
  // Shuffle
  for (let i = playerIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playerIds[i], playerIds[j]] = [playerIds[j], playerIds[i]];
  }
  const teamSize = 5
  const teams = []
  for (let i = 0; i < playerIds.length; i += teamSize) {
    teams.push({ id: Date.now()+i, name: `Team ${Math.floor(i/teamSize)+1}`, players: playerIds.slice(i, i+teamSize), score: 0 })
  }
  data.teams = teams
  writeData(data)
  res.json({ success:true, teams })
})

// Serve built frontend if present (for Docker all-in-one)
const distPath = path.resolve(__dirname, '../frontend/dist')
app.use(express.static(distPath))
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' })
  try { res.sendFile(path.join(distPath, 'index.html')) } catch { res.status(404).end() }
})

app.listen(PORT, () => console.log(`ballin-with-ocie server on ${PORT}`))
