export default function Admin() {
  const players = [
    { name: "Ocie", score: 15 },
    { name: "Jaylen", score: 12 },
    { name: "Chris", score: 10 }
  ];

  const tickets = [
    { name: "Sarah", count: 2 },
    { name: "Mike", count: 4 }
  ];

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-purple-500 mb-6 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-3">Shooting Scores</h2>
          {players.map((p, idx) => (
            <p key={idx}>{p.name}: {p.score}</p>
          ))}
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-3">Teams</h2>
          <p>Auto-assign teams coming soon...</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-3">Tickets</h2>
          {tickets.map((t, idx) => (
            <p key={idx}>{t.name} - {t.count} tickets</p>
          ))}
        </div>
      </div>
    </div>
  );
}