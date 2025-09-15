
export default function Admin() {
  const shootingScores = [
    { name: "Jordan", score: 15, time: "1:20" },
    { name: "Taylor", score: 12, time: "1:45" },
    { name: "Sam", score: 10, time: "1:50" },
  ];

  const tickets = [
    { name: "Ava", count: 2 },
    { name: "Liam", count: 4 },
  ];

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", color: "#8A2BE2", marginBottom: "1rem", textAlign: "center" }}>
        Admin Dashboard
      </h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: "10px" }}>Shooting Contest Scores</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#222" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Player</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Score</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {shootingScores.map((p, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "8px" }}>{p.name}</td>
                <td style={{ padding: "8px" }}>{p.score}</td>
                <td style={{ padding: "8px" }}>{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: "10px" }}>Ticket Requests</h2>
        <ul>
          {tickets.map((t, i) => (
            <li key={i} style={{ marginBottom: "5px" }}>{t.name} — {t.count} tickets</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
