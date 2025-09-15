import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const __dirname = path.resolve();
const dataPath = path.join(__dirname, 'server', 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.get('/api/data', (req,res)=>{
  const data = JSON.parse(fs.readFileSync(dataPath));
  res.json(data);
});

app.post('/admin/reset-data', (req,res)=>{
  const sampleData = {
    players: [{id:1,name:"Ocie Johnson",age:13,shootingScore:18,time:"00:42"}],
    teams: [],
    tickets: [{id:1,name:"Alice",tickets:2}],
    messages: [{id:1,name:"Coach K",message:"Let's go Ocie!",replies:[]}]
  };
  fs.writeFileSync(dataPath, JSON.stringify(sampleData,null,2));
  res.json({success:true,message:"Data reset successfully"});
});

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'frontend','dist','index.html'));
});

app.listen(4000,()=>console.log("Server running on port 4000"));
