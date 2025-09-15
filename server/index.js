import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const file = (name)=> path.join(__dirname, 'data', name);
const read = (name)=> JSON.parse(fs.readFileSync(file(name), 'utf-8'));
const write = (name, data)=> fs.writeFileSync(file(name), JSON.stringify(data, null, 2));
const ensure = (name, fallback)=> { if(!fs.existsSync(file(name))) write(name, fallback); return read(name); };
const uid = (pfx) => pfx + Math.random().toString(36).slice(2,9);

// seed files if missing
ensure('players.json', []);
ensure('tickets.json', []);
ensure('contest.json', []);
ensure('teams.json', {});
ensure('messages.json', []);

// registration
app.post('/api/register', (req,res)=>{
  const players = read('players.json');
  const p = { id: uid('reg_'), ...req.body };
  players.push(p);
  write('players.json', players);

  if (p?.events?.shooting) {
    const contest = read('contest.json');
    if (!contest.find(s => s.name === p.name)) {
      contest.push({ id: uid('sp_'), name: p.name, score: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
      write('contest.json', contest);
    }
  }
  res.json({ ok:true, id: p.id });
});

// tickets
app.post('/api/tickets', (req,res)=>{
  const tickets = read('tickets.json');
  const t = { id: uid('tix_'), name: req.body.name, quantity: Number(req.body.quantity)||1 };
  tickets.push(t);
  write('tickets.json', tickets);
  res.json({ ok:true, message:'Thank you! Your tickets will be available at the Box Office.' });
});

// messages
app.get('/api/messages', (req,res)=> res.json(read('messages.json')) );
app.post('/api/messages', (req,res)=>{
  const msgs = read('messages.json'); msgs.push({ id: uid('msg_'), ...req.body }); write('messages.json', msgs); res.json({ok:true});
});

// leaderboard (score desc, time asc)
app.get('/api/leaderboard', (req,res)=>{
  const contest = read('contest.json');
  const sorted = [...contest].sort((a,b)=> (b.score||0)-(a.score||0) || (a.totalSeconds||0)-(b.totalSeconds||0));
  res.json(sorted);
});

// admin getters
app.get('/api/admin/registrations', (req,res)=> res.json(read('players.json')) );
app.get('/api/admin/tickets', (req,res)=> res.json(read('tickets.json')) );
app.get('/api/admin/tickets/total', (req,res)=>{
  const total = read('tickets.json').reduce((a,b)=> a + (Number(b.quantity)||0), 0);
  res.json({ total });
});
app.get('/api/admin/shooting', (req,res)=> res.json(read('contest.json')) );
app.get('/api/admin/teams', (req,res)=> res.json(read('teams.json')) );

// admin save shooter (minutes:seconds)
app.patch('/api/admin/shooting/:id', (req,res)=>{
  const { id } = req.params;
  const contest = read('contest.json');
  const row = contest.find(x=>x.id===id);
  if(!row) return res.status(404).json({ ok:false, error:'not found' });
  if(typeof req.body.score !== 'undefined') row.score = Number(req.body.score)||0;
  if(typeof req.body.minutes !== 'undefined') row.minutes = Number(req.body.minutes)||0;
  if(typeof req.body.seconds !== 'undefined') row.seconds = Number(req.body.seconds)||0;
  row.totalSeconds = Math.max(0, (row.minutes||0)*60 + (row.seconds||0));
  write('contest.json', contest);
  res.json({ ok:true });
});

// auto-assign teams
app.post('/api/admin/auto-teams', (req,res)=>{
  const players = read('players.json').filter(p=>p?.events?.team).map(p=>p.name);
  const shuffled = [...players].sort(()=>Math.random()-0.5);
  const mid = Math.ceil(shuffled.length/2);
  const teams = { 'Team A': shuffled.slice(0,mid), 'Team B': shuffled.slice(mid) };
  write('teams.json', teams);
  res.json({ ok:true, teams });
});

// reset
app.post('/api/admin/reset', (req,res)=>{
  write('players.json', []);
  write('tickets.json', []);
  write('contest.json', []);
  write('teams.json', {});
  write('messages.json', []);
  res.json({ ok:true });
});

// serve built frontend (for Docker all-in-one deploy)
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req,res)=> res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, ()=> console.log('Server running on', PORT));
