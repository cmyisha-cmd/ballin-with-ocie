import { useState } from "react";

const ADMIN_PASSWORD = "admin123";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState("scores");

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setAuthenticated(true);
    else alert("Incorrect password");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <form onSubmit={handleLogin} className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} className="p-3 rounded bg-gray-800 w-full"/>
          <button type="submit" className="mt-4 bg-purple-600 px-4 py-2 rounded w-full">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold text-purple-500 mb-6">Admin Dashboard</h2>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setTab("scores")} className={`px-4 py-2 rounded ${tab === "scores" ? "bg-purple-700" : "bg-gray-800"}`}>Scores</button>
        <button onClick={() => setTab("teams")} className={`px-4 py-2 rounded ${tab === "teams" ? "bg-purple-700" : "bg-gray-800"}`}>Teams</button>
        <button onClick={() => setTab("tickets")} className={`px-4 py-2 rounded ${tab === "tickets" ? "bg-purple-700" : "bg-gray-800"}`}>Tickets</button>
      </div>
      {tab === "scores" && <p>Scores management UI here.</p>}
      {tab === "teams" && <p>Teams and bracket view here.</p>}
      {tab === "tickets" && <p>Ticket list and counts here.</p>}
    </div>
  );
}
