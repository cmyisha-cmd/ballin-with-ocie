import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "MISSING";

export default function Tickets() {
  const [form, setForm] = useState({ name: "", count: 1 });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/tickets`, form);
      setStatus("✅ Request received! Tickets will be available at the box office.");
      setForm({ name: "", count: 1 });
    } catch {
      setStatus("❌ Could not submit request.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-900 p-6 rounded-2xl text-white">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Request Tickets</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-gray-800"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-800"
          type="number"
          min="1"
          value={form.count}
          onChange={(e) => setForm({ ...form, count: e.target.value })}
        />
        <button className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded font-bold">
          Request
        </button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}