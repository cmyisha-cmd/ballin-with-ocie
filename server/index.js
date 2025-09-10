// Express backend for Ballin' with Ocie
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin2025';
const SECRET = process.env.ADMIN_JWT_SECRET || 'changeme';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname,'data.json');
let db = { players:[], tickets:[], messages:[], teams:[], shooting:[] };
if(fs.existsSync(DATA_FILE)) {
  try { db = JSON.parse(fs.readFileSync(DATA_FILE)) } catch(e) { console.error('Error reading data.json', e); }
}
function persist(){ fs.writeFileSync(DATA_FILE, JSON.stringify(db,null,2)); }

function signToken(payload){ return jwt.sign(payload, SECRET, {expiresIn:'6h'}); }
function auth(req,res,next){ const h=req.headers.authorization; if(!h) return res.status(401).json({error:'no token'}); const token=h.split(' ')[1]; try{ req.user=jwt.verify(token,SECRET); next(); }catch(e){ res.status(401).json({error:'invalid'}); } }

// Admin login
app.post('/api/admin/login',(req,res)=>{
  const {user, pass} = req.body;
  if(user===ADMIN_USER && pass===ADMIN_PASS){ return res.json({token:signToken({user})}); }
  res.status(401).json({error:'bad credentials'});
});

// Players
app.get('/api/players',(req,res)=>res.json(db.players));
app.post('/api/players',(req,res)=>{ const p={...req.body,id:'p'+Date.now()}; db.players.push(p); persist(); res.json(p); });

// Tickets
app.get('/api/tickets',(req,res)=>res.json(db.tickets));
app.post('/api/tickets',(req,res)=>{ const t={...req.body,id:'t'+Date.now()}; db.tickets.push(t); persist(); res.json(t); });

// Messages
app.get('/api/messages',(req,res)=>res.json(db.messages));
app.post('/api/messages',(req,res)=>{ const m={...req.body,id:'m'+Date.now(),replies:[]}; db.messages.push(m); persist(); res.json(m); });
app.post('/api/messages/:id/reply',(req,res)=>{ const msg=db.messages.find(m=>m.id===req.params.id); if(!msg) return res.status(404).end(); msg.replies.push(req.body); persist(); res.json(msg); });

// Shooting
app.get('/api/shooting',(req,res)=>{ const sorted=db.shooting.slice().sort((a,b)=> b.score-a.score || a.time-b.time); res.json(sorted); });
app.post('/api/shooting',auth,(req,res)=>{ const s=req.body; const idx=db.shooting.findIndex(x=>x.id===s.id); if(idx>=0) db.shooting[idx]=s; else db.shooting.push({...s,id:'s'+Date.now()}); persist(); res.json(s); });

// Teams
app.get('/api/teams',(req,res)=>res.json(db.teams));
app.post('/api/teams/assign',auth,(req,res)=>{
  const players=db.players.filter(p=>p.events && p.events.includes('Team'));
  const count=Math.max(2,Math.min(8,req.body.teamCount||2));
  const teams=[]; for(let i=0;i<count;i++) teams.push({name:`Team ${i+1}`,players:[]});
  players.forEach((p,i)=>teams[i%count].players.push({id:p.id,name:p.name}));
  db.teams=teams; persist(); res.json(teams);
});

app.listen(PORT,()=>console.log("Server running on "+PORT));
