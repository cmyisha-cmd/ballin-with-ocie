import React, { useState } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Tickets() {
  const [form, setForm] = useState({ name: "", count: 1 });
  const [status, setStatus] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/tickets`, { id: Date.now(), ...form, count: parseInt(form.count||'1',10)});
      setStatus("✅ Thank you! Your tickets will be available at the Box Office.");
      setForm({ name: "", count: 1 });
    } catch {
      setStatus("❌ Could not submit request.");
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Request Tickets</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full p-2 rounded bg-gray-800" placeholder="Your Name"
          value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="w-full p-2 rounded bg-gray-800" type="number" min="1"
          value={form.count} onChange={e=>setForm({...form, count:e.target.value})} />
        <button className="btn">Request</button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
