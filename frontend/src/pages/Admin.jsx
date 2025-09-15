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
