import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "MISSING";

export default function Admin() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [auth, setAuth] = useState(false);

  const fetchData = async () => {
    const [p, t, tk] = await Promise.all([
      axios.get(`${API_BASE}/api/players`),
      axios.get(`${API_BASE}/api/teams`),
      axios.get(`${API_BASE}/api/tickets`)
    ]);
    setPlayers(p.data);
    setTeams(t.data);
    setTickets(tk.data);
  };

  useEffect(() => { if (auth) fetchData(); }, [auth]);

  const handleLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/admin/login`, { user: "admin", pass: "ocie13" });
      setAuth(true);
    } catch { alert("Invalid login"); }
  };

  if (!auth)
    return (
      <div className="text-center mt-10">
        <button onClick={handleLogin} className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-2xl font-bold">
          Admin Login
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 text-white">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">Admin Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-4 rounded-xl">
          <h3 className="font-bold mb-2">Players</h3>
          <ul>{players.map((p) => <li key={p.id}>{p.name} — {p.score ?? "No score yet"}</li>)}</ul>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl">
          <h3 className="font-bold mb-2">Teams</h3>
          <ul>{teams.map((t, i) => <li key={i}>{t.name}: {t.players.length} players</li>)}</ul>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl md:col-span-2">
          <h3 className="font-bold mb-2">Tickets Requested</h3>
          <ul>{tickets.map((tk) => <li key={tk.id}>{tk.name}: {tk.count}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}