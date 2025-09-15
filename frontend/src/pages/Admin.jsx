function sortByScoreTime(rows){
  // Highest score first; if tie, least time (mm:ss) wins
  const toSecs = t => { const [m,s] = t.split(":").map(n=>parseInt(n,10)); return m*60+s; };
  return [...rows].sort((a,b)=> b.score - a.score || toSecs(a.time) - toSecs(b.time));
}

export default function Admin(){
  const leaderboard = sortByScoreTime([
    { name:"Ocie Johnson", score:18, time:"0:42" },
    { name:"Jaylen Rivers", score:18, time:"0:47" },
    { name:"Chris Dean", score:16, time:"0:39" },
  ]);

  const teams = [
    { name:"Team A", players:["Ocie", "Chris", "Malik", "Evan"] },
    { name:"Team B", players:["Jaylen", "Andre", "Noah", "Miles"] },
  ];

  const requests = [
    { name:"Ava Thompson", tickets:2 },
    { name:"Liam Carter", tickets:4 },
    { name:"Maya Lee", tickets:3 },
  ];
  const totalTickets = requests.reduce((sum,r)=>sum+r.tickets,0);

  return (
    <div style={{padding:"24px"}}>
      <h2 style={{color:"#8A2BE2", fontSize:"34px", fontWeight:900, marginBottom:12}}>Admin Dashboard</h2>

      <section style={cardSec}>
        <h3 style={cardTitle}>Shooting Contest Leaderboard</h3>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:"#222"}}>
              <th style={th}>Player</th><th style={th}>Score</th><th style={th}>Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid #2a2a2a"}}>
                <td style={td}>{r.name}</td><td style={td}>{r.score}</td><td style={td}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{marginTop:10, display:"flex", gap:8, flexWrap:"wrap"}}>
          <button style={buttonGhost}>+ Add Score</button>
          <button style={buttonGhost}>Auto-Assign Teams</button>
          <button style={buttonGhost}>Update Game Score</button>
        </div>
      </section>

      <section style={cardSec}>
        <h3 style={cardTitle}>Teams</h3>
        <div style={{display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"}}>
          {teams.map((t,i)=>(
            <div key={i} style={{background:"#151515", border:"1px solid #2a2a2a", borderRadius:10, padding:"10px 12px"}}>
              <strong style={{display:"block", color:"#bb86fc"}}>{t.name}</strong>
              <ul style={{margin:"8px 0 0 18px"}}>
                {t.players.map((p,idx)=>(<li key={idx} style={{marginBottom:4}}>{p}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={cardSec}>
        <h3 style={cardTitle}>Ticket Requests</h3>
        <div>Total Non‑Player Tickets: <strong>{totalTickets}</strong></div>
        <ul style={{marginTop:8}}>
          {requests.map((r,i)=>(<li key={i} style={{marginBottom:4}}>{r.name} — {r.tickets}</li>))}
        </ul>
      </section>
    </div>
  );
}

const cardSec = { background:"#111", border:"1px solid #2a2a2a", borderRadius:12, padding:"14px 16px", marginBottom:16 };
const cardTitle = { margin:"0 0 10px", fontSize:"22px", color:"#e8e8e8" };
const th = { textAlign:"left", padding:"8px 10px" };
const td = { padding:"8px 10px" };
const buttonGhost = { background:"#1f1f1f", color:"#bb86fc", border:"1px solid #3a3a3a", borderRadius:8, padding:"8px 10px", cursor:"pointer" };
