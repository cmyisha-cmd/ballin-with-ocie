import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory data for testing
let registrations = [
  { name:'Jordan Sparks', age:16, events:{shooting:true, team:true}, contact:'jsparks@example.com' }
];
let tickets = [
  { name:'A. Spectator', count:2, contact:'a.spectator@example.com' }
];
let leaderboard = [
  { name:'Ocie', score:23, time:38 },
  { name:'M. Carter', score:20, time:41 },
  { name:'J. Lee', score:18, time:43 }
];

// API routes
app.post('/api/register', (req,res)=>{
  registrations.push(req.body);
  res.json({ ok:true });
});

app.post('/api/tickets', (req,res)=>{
  tickets.push(req.body);
  res.json({ ok:true, message:"Thank you! Your tickets will be available at the Box Office." });
});

app.get('/api/leaderboard', (req,res)=> res.json(leaderboard));

// Admin data
app.get('/api/admin/registrations', (req,res)=> res.json(registrations));
app.get('/api/admin/tickets', (req,res)=> res.json(tickets));

app.post('/api/admin/reset', (req,res)=>{
  registrations = [];
  tickets = [];
  leaderboard = [
    { name:'Ocie', score:23, time:38 },
    { name:'M. Carter', score:20, time:41 },
    { name:'J. Lee', score:18, time:43 }
  ];
  res.json({ ok:true });
});

// Serve built frontend if present (Docker / single-host)
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.get('*', (req,res)=> res.sendFile(path.join(distPath, 'index.html')));

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
