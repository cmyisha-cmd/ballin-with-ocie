import React, { useState } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Register() {
  const [form, setForm] = useState({ name: "", age: "", shooting: true, team: true });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/players`, {
        id: Date.now(),
        name: form.name,
        age: parseInt(form.age || "0", 10),
        score: 0,
        time: 0,
        shooting: !!form.shooting,
        team: !!form.team
      });
      setMsg("✅ Registration successful!");
      setForm({ name: "", age: "", shooting: true, team: true });
    } catch {
      setMsg("❌ Failed to register.");
    }
  };

  return (
    <div className="card max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Register as a Player</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full p-2 rounded bg-gray-800" placeholder="Name"
          value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="w-full p-2 rounded bg-gray-800" placeholder="Age" type="number"
          value={form.age} onChange={e=>setForm({...form, age:e.target.value})} />
        <div className="flex gap-6">
          <label className="select-none"><input type="checkbox" className="mr-2"
            checked={form.shooting} onChange={()=>setForm({...form, shooting:!form.shooting})}/> Shooting Contest</label>
          <label className="select-none"><input type="checkbox" className="mr-2"
            checked={form.team} onChange={()=>setForm({...form, team:!form.team})}/> Team Tournament</label>
        </div>
        <button className="btn">Register</button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
