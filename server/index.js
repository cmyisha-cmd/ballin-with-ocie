import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --------------------
// In-memory "database"
// --------------------
let players = [];
let tickets = [];
let messages = [];

// ----------- Players API -----------
app.get("/api/players", (req, res) => res.json(players));

app.post("/api/players", (req, res) => {
  const { name, age, event } = req.body;
  if (!name || !event) return res.status(400).json({ error: "Missing fields" });

  players.push({ id: Date.now(), name, age, event, score: 0, time: 0 });
  res.json({ success: true });
});

// ----------- Tickets API -----------
app.get("/api/tickets", (req, res) => res.json(tickets));

app.post("/api/tickets", (req, res) => {
  const { name, count } = req.body;
  if (!name || !count) return res.status(400).json({ error: "Missing fields" });

  tickets.push({ id: Date.now(), name, count: Number(count) });
  res.json({ success: true });
});

// ----------- Messages API -----------
app.get("/api/messages", (req, res) => res.json(messages));

app.post("/api/messages", (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: "Missing fields" });

  messages.push({ id: Date.now(), name, message });
  res.json({ success: true });
});

// ----------- Admin: Update Scores -----------
app.post("/api/scores", (req, res) => {
  const { playerId, score, time } = req.body;
  const player = players.find((p) => p.id === playerId);
  if (!player) return res.status(404).json({ error: "Player not found" });

  player.score = score;
  player.time = time;
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
