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

async function readJSON(name, fallback){ try { const t = await fs.readFile(file(name),'utf8'); return JSON.parse(t) } catch { return fallback } }
async function writeJSON(name, val){ await fs.mkdir(dataDir, {recursive:true}); await fs.writeFile(file(name), JSON.stringify(val, null, 2)); }

// Fresh empty datasets
const emptyData = { players: [], shooting: [], tickets: [], teams: {A:[],B:[]}, messages: [] };

app.get('/api/health', (_req,res)=>res.json({ok:true}));

app.post('/api/register', async (req,res)=>{
  const { name, age, shooting, team } = req.body || {};
  if(!name) return res.status(400).json({message:'Name required'});
  const players = await readJSON('players.json', emptyData.players);
  const id = Date.now();
  const player = { id, name, age, shooting: !!shooting, team: !!team };
  players.push(player);
  await writeJSON('players.json', players);
  if(shooting){
    const shootingList = await readJSON('shooting.json', emptyData.shooting);
    shootingList.push({ id, name, score: 0, time:'00:00' });
    await writeJSON('shooting.json', shootingList);
  }
  res.json({message:'Registered!', player});
});

app.get('/api/messages', async (_req,res)=>{
  const m = await readJSON('messages.json', emptyData.messages); res.json(m);
});

app.post('/api/messages', async (req,res)=>{
  const { name, text } = req.body || {};
  if(!name || !text) return res.status(400).json({message:'Name and text required'});
  const m = await readJSON('messages.json', emptyData.messages);
  m.push({ id: Date.now(), name, text, reactions: {} });
  await writeJSON('messages.json', m);
  res.json({ok:true});
});

// Serve prebuilt frontend
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
