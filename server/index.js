import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const writeData = (d) => fs.writeFileSync(dataPath, JSON.stringify(d, null, 2));

// Players
app.get('/api/players', (req, res) => res.json(readData().players));
app.post('/api/players', (req, res) => {
  const data = readData();
  data.players.push(req.body);
  writeData(data);
  res.json({ ok: true });
});
app.patch('/api/players/:id', (req, res) => {
  const data = readData();
  const id = String(req.params.id);
  const p = data.players.find(x => String(x.id) === id);
  if (!p) return res.status(404).json({ error: 'Player not found' });
  if (typeof req.body.score !== 'undefined') p.score = req.body.score;
  if (typeof req.body.time !== 'undefined') p.time = req.body.time;
  writeData(data);
  res.json({ ok: true, player: p });
});

// Teams
app.get('/api/teams', (req, res) => res.json(readData().teams));
app.post('/api/teams/auto-assign', (req, res) => {
  const data = readData();
  const pool = data.players.filter(p => p.team);
  const names = ['Lakers', 'Celtics', 'Bulls', 'Warriors', 'Heat', 'Spurs'];
  const teamCount = Math.max(2, Math.min(6, Math.ceil(pool.length / 4)));
  const teams = Array.from({ length: teamCount }, (_, i) => ({ name: names[i] || `Team ${i+1}`, players: [] }));
  // simple round-robin assignment
  pool.forEach((p, idx) => {
    teams[idx % teamCount].players.push(p.name);
  });
  data.teams = teams;
  writeData(data);
  res.json({ ok: true, teams });
});

// Tickets
app.get('/api/tickets', (req, res) => res.json(readData().tickets));
app.post('/api/tickets', (req, res) => {
  const data = readData();
  data.tickets.push(req.body);
  writeData(data);
  res.json({ ok: true });
});

// Messages
app.get('/api/messages', (req, res) => res.json(readData().messages));
app.post('/api/messages', (req, res) => {
  const data = readData();
  data.messages.push(req.body);
  writeData(data);
  res.json({ ok: true });
});

// Admin login (simple static password)
app.post('/api/admin/login', (req, res) => {
  const { user, pass } = req.body || {};
  if (user === 'admin' && pass === 'ocie13') return res.json({ ok: true });
  res.status(401).json({ error: 'Invalid credentials' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
