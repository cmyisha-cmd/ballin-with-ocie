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

const dataPath = path.join(__dirname, 'data.json');
const read = ()=> JSON.parse(fs.readFileSync(dataPath,'utf-8'));
const write = (obj)=> fs.writeFileSync(dataPath, JSON.stringify(obj, null, 2));
const uid = (pfx) => pfx + Math.random().toString(36).slice(2,9);

// PUBLIC: register auto-adds to shootingPlayers if selected
app.post('/api/register', (req,res)=>{
  const db = read();
  const r = { id: uid('reg_'), ...req.body };
  db.registrations.push(r);
  // auto-add to shootingPlayers
  if (r?.events?.shooting) {
    if (!db.shootingPlayers.find(s => s.name === r.name)) {
      db.shootingPlayers.push({ id: uid('sp_'), name: r.name, score: 0, time: 0 });
    }
  }
  write(db);
  res.json({ ok:true, id:r.id });
});

// tickets
app.post('/api/tickets', (req,res)=>{
  const db = read();
  const t = { id: uid('tix_'), ...req.body };
  if(typeof t.quantity !== 'number') t.quantity = Number(t.quantity||1);
  db.tickets.push(t);
  write(db);
  res.json({ ok:true, message:'Thank you! Your tickets will be available at the Box Office.' });
});

// messages
app.get('/api/messages', (req,res)=> res.json(read().messages||[]));
app.post('/api/messages', (req,res)=>{
  const db = read(); db.messages.push({ id: uid('msg_'), ...req.body }); write(db); res.json({ok:true});
});

// leaderboard
app.get('/api/leaderboard', (req,res)=>{
  const db = read();
  const sorted = [...db.shootingPlayers].sort((a,b)=> (b.score||0)-(a.score||0) || (a.time||0)-(b.time||0));
  res.json(sorted);
});

// ADMIN getters
app.get('/api/admin/registrations', (req,res)=> res.json(read().registrations||[]));
app.get('/api/admin/tickets', (req,res)=> res.json(read().tickets||[]));
app.get('/api/admin/tickets/total', (req,res)=>{
  const sum = (read().tickets||[]).reduce((a,b)=> a + (Number(b.quantity)||0), 0);
  res.json({ total: sum });
});
app.get('/api/admin/shooting', (req,res)=> res.json(read().shootingPlayers||[]));
app.get('/api/admin/teams', (req,res)=> res.json(read().teams||{}));

// ADMIN update shooter score/time (Save button)
app.patch('/api/admin/shooting/:id', (req,res)=>{
  const { id } = req.params;
  const db = read();
  const s = (db.shootingPlayers||[]).find(x=>x.id===id);
  if(!s) return res.status(404).json({ ok:false, error:'not found' });
  if(typeof req.body.score !== 'undefined') s.score = Number(req.body.score)||0;
  if(typeof req.body.time !== 'undefined') s.time = Number(req.body.time)||0;
  write(db);
  res.json({ ok:true });
});

// ADMIN auto-assign teams based on registrations that selected team
app.post('/api/admin/auto-teams', (req,res)=>{
  const db = read();
  const pool = (db.registrations||[]).filter(r=>r?.events?.team).map(r=>r.name);
  const shuffled = [...pool].sort(()=>Math.random()-0.5);
  const mid = Math.ceil(shuffled.length/2);
  db.teams = { 'Team A': shuffled.slice(0,mid), 'Team B': shuffled.slice(mid) };
  write(db);
  res.json({ ok:true, teams: db.teams });
});

// ADMIN reset data
app.post('/api/admin/reset', (req,res)=>{
  const blank = {
    registrations: [],
    tickets: [],
    messages: [],
    shootingPlayers: [],
    teams: {}
  };
  write(blank);
  res.json({ ok:true });
});

// serve built frontend if present (for Docker all-in-one deploy)
const dist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(dist));
app.get('*', (req,res)=> res.sendFile(path.join(dist, 'index.html')));

app.listen(PORT, ()=> console.log('Server running on', PORT));
