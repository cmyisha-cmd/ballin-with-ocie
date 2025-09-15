import React, { useEffect, useState } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [scoreForm, setScoreForm] = useState({ id: "", score: "", time: "" });

  const load = async () => {
    const [p, t, tk] = await Promise.all([
      axios.get(`${API_BASE}/api/players`),
      axios.get(`${API_BASE}/api/teams`),
      axios.get(`${API_BASE}/api/tickets`)
    ]);
    setPlayers(p.data || []);
    setTeams(t.data || []);
    setTickets(t.data || []);
  };

  const login = async () => {
    try {
      await axios.post(`${API_BASE}/api/admin/login`, { user: "admin", pass: "ocie13" });
      setAuthed(true);
      load();
    } catch {
      alert("Invalid login");
    }
  };

  const saveScore = async (e) => {
    e.preventDefault();
    if (!scoreForm.id) return;
    await axios.patch(`${API_BASE}/api/players/${scoreForm.id}`, {
      score: parseInt(scoreForm.score || "0", 10),
      time: parseFloat(scoreForm.time || "0")
    });
    setScoreForm({ id: "", score: "", time: "" });
    load();
  };

  const autoAssign = async () => {
    await axios.post(`${API_BASE}/api/teams/auto-assign`);
    load();
  };

  if (!authed) {
    return (
      <div className="text-center mt-10">
        <button onClick={login} className="btn px-6 py-3">Admin Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-purple-400 mb-6">Admin Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold mb-3">Input Shooting Scores</h3>
          <form onSubmit={saveScore} className="grid grid-cols-3 gap-2">
            <select className="bg-gray-800 p-2 rounded"
              value={scoreForm.id} onChange={e=>setScoreForm({...scoreForm, id:e.target.value})}>
              <option value="">Select Player</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input className="bg-gray-800 p-2 rounded" placeholder="Score" type="number"
              value={scoreForm.score} onChange={e=>setScoreForm({...scoreForm, score:e.target.value})} />
            <input className="bg-gray-800 p-2 rounded" placeholder="Time (s)" type="number" step="0.01"
              value={scoreForm.time} onChange={e=>setScoreForm({...scoreForm, time:e.target.value})} />
            <button className="btn col-span-3">Save</button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-bold mb-3">Tournament Teams</h3>
          <button onClick={autoAssign} className="btn mb-3">Auto Assign Teams</button>
          <ul className="space-y-2">
            {teams.map((t, i) => (
              <li key={i} className="bg-gray-800 p-3 rounded">
                <strong>{t.name}</strong> — {t.players?.length || 0} players
                <div className="text-xs text-gray-400">{(t.players||[]).join(", ")}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card md:col-span-2">
          <h3 className="font-bold mb-3">Tickets Requested</h3>
          <ul className="space-y-1">
            {tickets.map(t => (
              <li key={t.id}>{t.name} — {t.count}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
