
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let players = [];
let tickets = [];

app.get('/api/players', (req,res)=> res.json(players));
app.post('/api/players', (req,res)=> { players.push(req.body); res.json({status:'ok'}); });

app.get('/api/tickets', (req,res)=> res.json(tickets));
app.post('/api/tickets', (req,res)=> { tickets.push(req.body); res.json({status:'ok'}); });

app.listen(4000, ()=> console.log("Server running on port 4000"));
