import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Wide open CORS for testing ---
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'x-admin-pass']
}));

app.use(express.json());

const ADMIN_PASS = 'ocie2025';
const dataDir = path.join(__dirname, 'data');
const file = (name) => path.join(dataDir, name);

// --- Helpers ---
async function readJSON(name, fallback) {
  try {
    const t = await fs.readFile(file(name), 'utf8');
    return JSON.parse(t);
  } catch {
    return fallback;
  }
}
async function writeJSON(name, val) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(file(name), JSON.stringify(val, null, 2));
}

// --- Initial seed data ---
const seed = {
  players: [],
  tickets: [],
  messages: [],
  shooting: [],
  teams: { A: [], B: [] }
};

// --- Player Registration ---
app.post('/api/register', async (req, res) => {
  const { name, age, shooting, team } = req.body;
  if (!name || !age) {
    return res.status(400).json({ message: "Name and age required" });
  }

  const db = await readJSON('db.json', seed);
  const player = { id: Date.now(), name, age, shooting, team, score: 0, time: "00:00" };
  db.players.push(player);

  // Also track for shooting if selected
  if (shooting) db.shooting.push(player);

  // Placeholders for teams (manual assignment or auto)
  if (team) {
    if (db.teams.A.length <= db.teams.B.length) db.teams.A.push(player);
    else db.teams.B.push(player);
  }

  await writeJSON('db.json', db);
  res.json({ message: "Registered successfully!" });
});

// --- Ticket Purchase ---
app.post('/api/tickets', async (req, res) => {
  const { buyer, quantity } = req.body;
  if (!buyer || !quantity) {
    return res.status(400).json({ message: "Buyer and quantity required" });
  }

  const db = await readJSON('db.json', seed);
  db.tickets.push({ id: Date.now(), buyer, quantity });
  await writeJSON('db.json', db);

  res.json({ message: "Tickets purchased successfully!" });
});

// --- Message Board ---
app.post('/api/message', async (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ message: "Author and text required" });
  }

  const db = await readJSON('db.json', seed);
  db.messages.push({ id: Date.now(), author, text });
  await writeJSON('db.json', db);

  res.json({ message: "Message posted successfully!" });
});

// --- Admin login ---
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    res.json({ ok: true });
  } else {
    res.status(403).json({ ok: false, message: "Invalid password" });
  }
});

// --- GET routes for Admin Dashboard ---
app.get('/api/players', async (req, res) => {
  const db = await readJSON('db.json', seed);
  res.json(db.players || []);
});

app.get('/api/tickets', async (req, res) => {
  const db = await readJSON('db.json', seed);
  res.json(db.tickets || []);
});

app.get('/api/messages', async (req, res) => {
  const db = await readJSON('db.json', seed);
  res.json(db.messages || []);
});

// --- Shooting Contest ---
app.get('/api/shooting', async (req, res) => {
  const db = await readJSON('db.json', seed);
  res.json(db.shooting || []);
});

app.patch('/api/shooting/:id', async (req, res) => {
  const { id } = req.params;
  const { score, time } = req.body;

  const db = await readJSON('db.json', seed);
  const player = db.shooting.find(p => String(p.id) === String(id));
  if (!player) return res.status(404).json({ message: "Player not found" });

  player.score = Number(score || 0);
  player.time = time || "00:00";

  await writeJSON('db.json', db);
  res.json({ message: "Score updated" });
});

// --- Teams ---
app.get('/api/teams', async (req, res) => {
  const db = await readJSON('db.json', seed);
  res.json(db.teams || { A: [], B: [] });
});

app.post('/api/teams/auto', async (req, res) => {
  if (req.headers['x-admin-pass'] !== ADMIN_PASS) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const db = await readJSON('db.json', seed);
  db.teams = { A: [], B: [] };

  db.players.forEach((p, i) => {
    if (i % 2 === 0) db.teams.A.push(p);
    else db.teams.B.push(p);
  });

  await writeJSON('db.json', db);
  res.json({ message: "Teams auto-assigned" });
});

// --- Reset all data ---
app.post('/api/reset', async (req, res) => {
  if (req.headers['x-admin-pass'] !== ADMIN_PASS) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await writeJSON('db.json', seed);
  res.json({ message: "All data cleared" });
});

// --- Default route (health check) ---
app.get('/', (req, res) => {
  res.send('Ballin with Ocie server is running 🚀');
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
