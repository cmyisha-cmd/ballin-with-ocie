import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());

let players = [];
let tickets = [];
let messages = [{name:'Sample', text:'Happy Birthday!'}];

app.post('/api/register', (req, res) => {
  players.push(req.body);
  res.json({ success:true, players });
});

app.post('/api/tickets', (req, res) => {
  tickets.push(req.body);
  res.json({ success:true, tickets });
});

app.post('/api/message', (req, res) => {
  messages.push(req.body);
  res.json({ success:true, messages });
});

app.get('/api/data', (req,res)=>{
  res.json({ players, tickets, messages });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Mock server running on ${PORT}`));
