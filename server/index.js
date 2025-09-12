import express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = "./data.json";
function readData() {
  if (!fs.existsSync(DATA_FILE)) return { players: [], teams: [], tickets: [], messages: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API routes (players, shooting, teams, tickets, messages, admin login) identical to previous build

app.get("/api/players",(req,res)=>{res.json(readData().players)});
app.post("/api/players",(req,res)=>{
  const data=readData();
  const player={id:Date.now().toString(),...req.body};
  data.players.push(player); writeData(data); res.json(player);
});

app.get("/api/shooting",(req,res)=>{
  const {players}=readData();
  const shooting=players.filter(p=>p.score!==undefined);
  shooting.sort((a,b)=> b.score - a.score || a.time - b.time);
  res.json(shooting);
});
app.post("/api/shooting/score",(req,res)=>{
  const {playerId,score,time}=req.body;
  const data=readData();
  const player=data.players.find(p=>p.id===playerId);
  if(!player) return res.status(404).json({error:"Player not found"});
  player.score=parseInt(score); player.time=parseInt(time);
  writeData(data); res.json(player);
});

app.get("/api/teams",(req,res)=>{res.json(readData().teams)});
app.post("/api/teams/assign",(req,res)=>{
  const {teamCount}=req.body;
  const data=readData();
  const players=[...data.players];
  let teams=Array.from({length:teamCount},(_,i)=>({name:`Team ${i+1}`,players:[],score:0}));
  players.forEach((p,idx)=>{teams[idx%teamCount].players.push(p)});
  data.teams=teams; writeData(data); res.json(teams);
});
app.post("/api/teams/score",(req,res)=>{
  const {teamName,score}=req.body;
  const data=readData();
  const team=data.teams.find(t=>t.name===teamName);
  if(!team) return res.status(404).json({error:"Team not found"});
  team.score=parseInt(score); writeData(data); res.json(team);
});

app.get("/api/tickets",(req,res)=>{res.json(readData().tickets)});
app.post("/api/tickets",(req,res)=>{
  const data=readData();
  const ticket={id:Date.now().toString(),...req.body};
  data.tickets.push(ticket); writeData(data); res.json(ticket);
});

app.get("/api/messages",(req,res)=>{res.json(readData().messages)});
app.post("/api/messages",(req,res)=>{
  const data=readData();
  const message={id:Date.now().toString(),...req.body,replies:[]};
  data.messages.push(message); writeData(data); res.json(message);
});

app.post("/api/admin/login",(req,res)=>{
  const {user,pass}=req.body;
  if(user==="admin" && pass==="ocie13"){res.json({token:"secret-token"});}
  else{res.status(401).json({error:"Invalid credentials"});}
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
