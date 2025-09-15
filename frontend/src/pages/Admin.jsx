import { useState } from "react";
export default function Admin() {
  const [scores, setScores] = useState([{player:"John", score:15},{player:"Mike", score:10}]);

  return (
    <div style={{padding:"2rem"}}>
      <h2 style={{color:"#8A2BE2"}}>Admin Dashboard</h2>
      <h3>Shooting Contest Scores</h3>
      <ul>
        {scores.map((s,i)=><li key={i}>{s.player}: {s.score}</li>)}
      </ul>
    </div>
  );
}