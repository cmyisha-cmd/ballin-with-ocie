import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const dataPath = path.join(__dirname,'server','data.json');

const sampleData = {
  players:[{id:1,name:'Ocie Johnson',age:13,shootingScore:18,time:'00:42'}],
  teams:[],
  tickets:[{id:1,name:'Alice',tickets:2}],
  messages:[{id:1,name:'Coach K',message:"Let's go Ocie!",replies:[]}]
};

fs.writeFileSync(dataPath, JSON.stringify(sampleData,null,2));
console.log("✅ Sample data seeded!");
