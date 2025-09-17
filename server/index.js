import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_PASS = 'ocie2025';
const dataDir = path.join(__dirname, 'data');
const file = (name) => path.join(dataDir, name);

async function readJSON(name, fallback){
  try { const t = await fs.readFile(file(name),'utf8'); return JSON.parse(t) }
  catch { return fallback }
}
async function writeJSON(name, val){
  await fs.mkdir(dataDir, {recursive:true});
  await fs.writeFile(file(name), JSON.stringify(val, null, 2));
}

// start with empty data
const seed = {players:[], shooting:[], teams:{A:[],B:[]}, tickets:[], messages:[]};

app.get('/api/health', (_req,res)=>res.json({ok:true}));

app.post('/api/register', async (req,res)=>{
  const { name, age, shooting, team } = req.body || {};
  if(!name) return res.status(400).json({message:'Name required'});
  const players = await readJSON('players.json', seed.players);
  const id = Date.now();
  const player = { id, name, age, shooting: !!shooting, team: !!team };
  players.push(player);
  await writeJSON('players.json', players);
  if(shooting){
    const shootingList = await readJSON('shooting.json', seed.shooting);
    shootingList.push({ id, name, score: 0, time:'00:00' });
    await writeJSON('shooting.json', shootingList);
  }
  res.json({message:'Registered!', player});
});

app.get('/api/messages', async (_req,res)=>{
  res.json(await readJSON('messages.json', seed.messages));
});
app.post('/api/messages', async (req,res)=>{
  const { name, text } = req.body || {};
  if(!name||!text) return res.status(400).json({message:'Name and text required'});
  const m = await readJSON('messages.json', seed.messages);
  m.push({ id: Date.now(), name, text, reactions:{} });
  await writeJSON('messages.json', m);
  res.json({ok:true});
});

app.delete('/api/messages/:id', async (req,res)=>{
  if(req.headers['x-admin-pass'] !== ADMIN_PASS) return res.status(401).json({message:'Unauthorized'});
  const id = Number(req.params.id);
  const m = await readJSON('messages.json', seed.messages);
  await writeJSON('messages.json', m.filter(x=>x.id!==id));
  res.json({ok:true});
});

app.post('/api/reset', async (req,res)=>{
  if(req.headers['x-admin-pass'] !== ADMIN_PASS) return res.status(401).json({message:'Unauthorized'});
  await writeJSON('players.json', seed.players);
  await writeJSON('shooting.json', seed.shooting);
  await writeJSON('tickets.json', seed.tickets);
  await writeJSON('messages.json', seed.messages);
  await writeJSON('teams.json', seed.teams);
  res.json({ok:true});
});

app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
