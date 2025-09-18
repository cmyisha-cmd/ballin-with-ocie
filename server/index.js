import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Explicit CORS setup (fix for Vercel/Render cross-domain) ---
app.use(cors({
  origin: [
    'https://ocietourney.com',            // your custom domain
    'https://www.ocietourney.com',        // www version
    'https://ocie-tourney.vercel.app'     // Vercel preview domain
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
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
  messages: []
};

// --- Player Registration ---
app.post('/api/register', async (req, res) => {
  const { name, age, shooting, team } = req.body;
  if (!name || !age) {
    return res.status(400).json({ message: "Name and age required" });
  }

  const db = await readJSON('db.json', seed);
  db.players.push({ id: Date.now(), name, age, shooting, team });
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
    return res.status(400).json({ message: "Author and text required"
