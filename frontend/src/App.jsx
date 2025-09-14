import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "MISSING";

export default function App() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    if (API_BASE === "MISSING") {
      setApiStatus("missing");
      return;
    }
    axios.get(`${API_BASE}/api/players`)
      .then(res => { setPlayers(res.data); setApiStatus("ok"); })
      .catch(() => setApiStatus("error"));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {apiStatus === "missing" && <div className="bg-red-600 text-center py-2 text-sm font-bold">❌ VITE_API_BASE is not set!</div>}
      {apiStatus === "error" && <div className="bg-orange-600 text-center py-2 text-sm font-bold">⚠️ Cannot reach API at {API_BASE}</div>}
      {apiStatus === "ok" && <div className="bg-green-700 text-center py-2 text-sm font-bold">✅ API Connected</div>}

      <header className="text-center py-8 bg-gradient-to-r from-purple-900 to-purple-600 shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide uppercase">Ballin’ with Ocie: 13th Edition</h1>
        <p className="text-lg mt-2">September 27, 2025 • 2:00 PM</p>
        <p className="text-sm opacity-80">P.B. Edwards Jr. Gymnasium • Port Wentworth, GA</p>
      </header>

      <div className="grid gap-4 grid-cols-2 max-w-3xl mx-auto mt-6">
        <button onClick={() => navigate("/register")} className="bg-purple-700 hover:bg-purple-600 py-3 rounded-2xl text-lg font-semibold shadow-md">Register as a Player</button>
        <button onClick={() => navigate("/tickets")} className="bg-purple-700 hover:bg-purple-600 py-3 rounded-2xl text-lg font-semibold shadow-md">Get Tickets</button>
        <button onClick={() => navigate("/messages")} className="bg-purple-700 hover:bg-purple-600 py-3 rounded-2xl text-lg font-semibold shadow-md">Leave a Birthday Message</button>
        <button onClick={() => navigate("/admin")} className="bg-purple-700 hover:bg-purple-600 py-3 rounded-2xl text-lg font-semibold shadow-md">Admin Login</button>
      </div>

      <section className="max-w-xl mx-auto mt-10 bg-gray-900 rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Shooting Contest Leaderboard</h2>
        {players.length === 0 ? (
          <p className="text-gray-400 text-sm">No players yet</p>
        ) : (
          <ul>
            {players.sort((a,b)=>b.score - a.score || a.time - b.time).map(p => (
              <li key={p.id} className="flex justify-between py-2 border-b border-gray-700 last:border-0">
                <span>{p.name}</span>
                <span className="font-bold">{p.score ?? 0} pts ({p.time ?? 0}s)</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-auto py-4 text-center text-xs text-gray-500">© 2025 Ballin’ with Ocie — Built with ❤️</footer>
    </div>
  );
}
