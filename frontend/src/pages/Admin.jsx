// frontend/src/pages/Admin.jsx
import { useEffect, useState } from "react";

export default function Admin() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/api/register")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem", background:"#000", color:"#fff", minHeight:"100vh" }}>
      <h2 style={{ color:"#8A2BE2", marginBottom:"1rem" }}>Admin Dashboard</h2>
      <table style={{ width:"100%", background:"#111", borderRadius:"12px" }}>
        <thead>
          <tr style={{ background:"#222" }}>
            <th>Name</th>
            <th>Age</th>
            <th>Shooting?</th>
            <th>Team?</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i}>
              <td>{p.playerName}</td>
              <td>{p.age}</td>
              <td>{p.shooting ? "✅" : "❌"}</td>
              <td>{p.team ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// Add inside Admin.jsx, below players table
<h3 style={{ marginTop:"2rem", color:"#8A2BE2" }}>Spectator Tickets</h3>
<ul>
  {tickets.map((t, i) => (
    <li key={i}>{t.name} - {t.count} tickets</li>
  ))}
</ul>

<h3 style={{ marginTop:"2rem", color:"#8A2BE2" }}>Messages</h3>
<ul>
  {messages.map((m, i) => (
    <li key={i}><strong>{m.name}:</strong> {m.message}</li>
  ))}
</ul>
