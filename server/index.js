
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

async function readJSON(name, fallback) {
  try { const t = await fs.readFile(file(name),'utf8'); return JSON.parse(t); }
  catch { return fallback; }
}
async function writeJSON(name, val) {
  await fs.mkdir(dataDir, {recursive:true});
  await fs.writeFile(file(name), JSON.stringify(val, null, 2));
}

app.get('/api/health', (_req,res)=>res.json({ok:true}));

// other routes go here...

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
