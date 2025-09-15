import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function App() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [apiStatus, setApiStatus] = useState("checking");

  const load = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/players`);
      setPlayers(res.data || []);
      setApiStatus("ok");
    } catch (e) {
      setApiStatus("error");
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // 🔁 auto-refresh every 5s
    return () => clearInterval(t);
  }, []);

  const sorted = [...players].sort((a, b) => {
    const s = (b.score ?? 0) - (a.score ?? 0);
    if (s !== 0) return s;
    return (a.time ?? Infinity) - (b.time ?? Infinity);
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {apiStatus === "error" && (
        <div className="bg-red-700 text-center py-2 text-sm font-bold">
          ⚠️ Cannot reach API at {API_BASE}
        </div>
      )}

      <header className="text-center py-8 hdr shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide uppercase">
          Ballin’ with Ocie: 13th Edition
        </h1>
        <p className="text-lg mt-2">September 27, 2025 • 2:00 PM</p>
        <p className="text-sm opacity-90">
          P.B. Edwards Jr. Gymnasium • 101 Turnberry St, Port Wentworth, GA 31407
        </p>
      </header>

      <div className="grid gap-4 grid-cols-2 max-w-3xl mx-auto mt-6 px-4 w-full">
        <button onClick={() => navigate("/register")} className="btn">Register as a Player</button>
        <button onClick={() => navigate("/tickets")} className="btn">Get Tickets</button>
        <button onClick={() => navigate("/messages")} className="btn">Birthday Messages</button>
        <button onClick={() => navigate("/admin")} className="btn">Admin Login</button>
      </div>

      <section className="card max-w-xl mx-auto mt-10 w-[92%]">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Shooting Contest Leaderboard</h2>
        {sorted.length === 0 ? (
          <p className="text-gray-400 text-sm">No players yet</p>
        ) : (
          <ul>
            {sorted.map((p) => (
              <li key={p.id ?? p.name} className="flex justify-between py-2 border-b border-gray-800 last:border-0">
                <span>{p.name}</span>
                <span className="font-bold">{p.score ?? 0} pts ({p.time ?? 0}s)</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-auto py-6 text-center text-xs text-gray-500">
        © 2025 Ballin’ with Ocie — Built with ❤️
      </footer>
    </div>
  );
}
