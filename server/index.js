import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let players = [];
let tickets = [];
let messages = [];

app.post('/api/players', (req, res) => {
  const { name, age, event } = req.body;
  players.push({ id: Date.now(), name, age, event, score: 0, time: 0 });
  res.json({ success: true });
});

app.get('/api/players', (req, res) => res.json(players));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
