import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/api/players", (req,res) => {
  res.json([{id:1, name:"Sample Player", score:"10", time:"00:30"}]);
});

app.listen(4000, () => console.log("Server running on port 4000"));