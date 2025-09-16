import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*'} });

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const file = (name)=> path.join(__dirname, 'data', name);
const read = (name)=> JSON.parse(fs.readFileSync(file(name), 'utf-8'));
const write = (name, data)=> fs.writeFileSync(file(name), JSON.stringify(data, null, 2));
const ensure = (name, fallback)=> { if(!fs.existsSync(file(name))) write(name, fallback); return read(name); };
const uid = (pfx) => pfx + Math.random().toString(36).slice(2,9);

// naive profanity filter
const BAD = ['damn','hell','shit','fuck'];
const clean = (s='')=>{
  let out = String(s);
  BAD.forEach(b=>{
    const re = new RegExp(b, 'ig');
    out = out.replace(re, '***');
  });
  return out;
};

// seed files
ensure('players.json', []);
ensure('tickets.json', []);
ensure('contest.json', []);
ensure('teams.json', {});
ensure('messages.json', []);

// ---- Registration ----
app.post('/api/register', (req,res)=>{
  const players = read('players.json');
  const p = { id: uid('reg_'), name: clean(req.body.name), age: req.body.age, events: req.body.events||{} };
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

// ---- Tickets ----
app.post('/api/tickets', (req,res)=>{
  const tickets = read('tickets.json');
  const t = { id: uid('tix_'), name: clean(req.body.name), quantity: Number(req.body.quantity)||1 };
  tickets.push(t);
  write('tickets.json', tickets);
  res.json({ ok:true, message:'Thank you! Your tickets will be available at the Box Office.' });
});

// ---- Messages (realtime, replies, reactions, moderation) ----
app.get('/api/messages', (req,res)=> res.json(read('messages.json')) );

app.post('/api/messages', (req,res)=>{
  const { parentId, name, text } = req.body;
  const messages = read('messages.json');
  if (parentId) {
    const m = messages.find(x=>x.id===parentId);
    if(!m) return res.status(404).json({ ok:false, error:'parent not found' });
    m.replies = m.replies || [];
    m.replies.push({ id: uid('rep_'), name: clean(name), text: clean(text), reactions: {} });
    write('messages.json', messages);
  } else {
    messages.push({ id: uid('msg_'), name: clean(name), text: clean(text), reactions: {}, replies: [] });
    write('messages.json', messages);
  }
  io.emit('messages:update');
  res.json({ ok:true });
});

app.patch('/api/messages/:id/react', (req,res)=>{
  const { id } = req.params;
  const { emoji, replyId } = req.body;
  if(!emoji) return res.status(400).json({ ok:false, error:'emoji required' });
  const messages = read('messages.json');
  const m = messages.find(x=>x.id===id);
  if(!m) return res.status(404).json({ ok:false, error:'message not found' });
  if (replyId) {
    const r = (m.replies||[]).find(x=>x.id===replyId);
    if(!r) return res.status(404).json({ ok:false, error:'reply not found' });
    r.reactions = r.reactions || {};
    r.reactions[emoji] = (r.reactions[emoji]||0) + 1;
  } else {
    m.reactions = m.reactions || {};
    m.reactions[emoji] = (m.reactions[emoji]||0) + 1;
  }
  write('messages.json', messages);
  io.emit('messages:update');
  res.json({ ok:true });
});

app.delete('/api/messages/:id', (req,res)=>{
  const { id } = req.params;
  const { replyId } = req.body || {};
  const messages = read('messages.json');
  const idx = messages.findIndex(x=>x.id===id);
  if(idx===-1) return res.status(404).json({ ok:false, error:'not found' });
  if (replyId) {
    const m = messages[idx];
    m.replies = (m.replies||[]).filter(r=>r.id!==replyId);
    write('messages.json', messages);
  } else {
    messages.splice(idx,1);
    write('messages.json', messages);
  }
  io.emit('messages:update');
  res.json({ ok:true });
});

// ---- Leaderboard ----
app.get('/api/leaderboard', (req,res)=>{
  const contest = read('contest.json');
  const sorted = [...contest].sort((a,b)=> (b.score||0)-(a.score||0) || (a.totalSeconds||0)-(b.totalSeconds||0));
  res.json(sorted);
});

// ---- Admin GET ----
app.get('/api/admin/registrations', (req,res)=> res.json(read('players.json')) );
app.get('/api/admin/tickets', (req,res)=> res.json(read('tickets.json')) );
app.get('/api/admin/tickets/total', (req,res)=>{
  const total = read('tickets.json').reduce((a,b)=> a + (Number(b.quantity)||0), 0);
  res.json({ total });
});
app.get('/api/admin/shooting', (req,res)=> res.json(read('contest.json')) );
app.get('/api/admin/teams', (req,res)=> res.json(read('teams.json')) );

// ---- Admin SAVE shooter (MM:SS) ----
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

// ---- Auto-assign teams ----
app.post('/api/admin/auto-teams', (req,res)=>{
  const players = read('players.json').filter(p=>p?.events?.team).map(p=>p.name);
  const shuffled = [...players].sort(()=>Math.random()-0.5);
  const mid = Math.ceil(shuffled.length/2);
  const teams = { 'Team A': shuffled.slice(0,mid), 'Team B': shuffled.slice(mid) };
  write('teams.json', teams);
  res.json({ ok:true, teams });
});

// ---- Reset test data ----
app.post('/api/admin/reset', (req,res)=>{
  write('players.json', []);
  write('tickets.json', []);
  write('contest.json', []);
  write('teams.json', {});
  write('messages.json', []);
  io.emit('messages:update');
  res.json({ ok:true });
});

// serve built frontend (for Docker all-in-one)
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req,res)=> res.sendFile(path.join(dist, 'index.html')));
}

// socket.io basic log
io.on('connection', (socket)=>{
  console.log('client connected', socket.id);
  socket.on('disconnect', ()=> console.log('client disconnected', socket.id));
});

httpServer.listen(PORT, ()=> console.log('Server running on', PORT));
