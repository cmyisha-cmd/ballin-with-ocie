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

// data store
const dataPath = path.join(__dirname, 'data.json');
if(!fs.existsSync(dataPath)){
  fs.writeFileSync(dataPath, JSON.stringify({
    registrations: [{ name:'Jordan Sparks', age:16, events:{shooting:true, team:true} }],
    tickets: [{ name:'A. Spectator', count:2 }],
    messages: [{ name:'Coach', text:'Happy Birthday and good luck!', ts: Date.now() }],
    leaderboard: [{ name:'Ocie', score:23, time:38 }, { name:'M. Carter', score:20, time:41 }]
  }, null, 2));
}
const read = ()=> JSON.parse(fs.readFileSync(dataPath,'utf-8'));
const write = (obj)=> fs.writeFileSync(dataPath, JSON.stringify(obj, null, 2));

// routes
app.post('/api/register', (req,res)=>{
  const db = read(); db.registrations.push(req.body); write(db); res.json({ok:true});
});
app.post('/api/tickets', (req,res)=>{
  const db = read(); db.tickets.push(req.body); write(db); res.json({ok:true,message:'Thank you! Your tickets will be available at the Box Office.'});
});
app.get('/api/leaderboard', (req,res)=>{
  const db = read(); 
  const sorted = db.leaderboard.sort((a,b)=> b.score-a.score || a.time-b.time);
  res.json(sorted);
});
app.post('/api/admin/score', (req,res)=>{
  const { index, field, value } = req.body;
  const db = read();
  if(db.leaderboard[index]){
    db.leaderboard[index][field] = value;
    write(db);
    return res.json({ok:true});
  }
  res.status(400).json({ok:false});
});
app.post('/api/admin/auto-teams', (req,res)=>{
  const db = read();
  // simple team auto-assign: alternate players to Team A / Team B
  const players = db.registrations.map(r=>r.name);
  const teams = { 'Team A':[], 'Team B':[] };
  players.forEach((p,i)=> (i%2===0?teams['Team A']:teams['Team B']).push(p));
  // store in db for future (not displayed here to keep classic layout)
  db.teams = teams; write(db);
  res.json({ok:true, teams});
});
app.get('/api/messages', (req,res)=>{
  const db = read(); res.json(db.messages||[]);
});
app.post('/api/messages', (req,res)=>{
  const db = read(); db.messages.push(req.body); write(db); res.json({ok:true});
});

// admin fetch
app.get('/api/admin/registrations', (req,res)=>{ res.json(read().registrations||[]); });
app.get('/api/admin/tickets', (req,res)=>{ res.json(read().tickets||[]); });

// serve built frontend when containerized together
const dist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(dist));
app.get('*', (req,res)=> res.sendFile(path.join(dist, 'index.html')));

app.listen(PORT, ()=> console.log('Server running on', PORT));
