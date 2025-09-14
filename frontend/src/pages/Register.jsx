import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "MISSING";

export default function Register() {
  const [form, setForm] = useState({ name: "", age: "", shooting: false, team: false });
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/players`, {
        name: form.name,
        age: parseInt(form.age),
        shooting: form.shooting,
        team: form.team
      });
      setSuccess("✅ Registration successful!");
      setForm({ name: "", age: "", shooting: false, team: false });
    } catch {
      setSuccess("❌ Failed to register.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gray-900 p-6 rounded-2xl shadow-lg text-white">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Register as a Player</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-gray-800"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-800"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              checked={form.shooting}
              onChange={() => setForm({ ...form, shooting: !form.shooting })}
            /> Shooting Contest
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.team}
              onChange={() => setForm({ ...form, team: !form.team })}
            /> Team Tournament
          </label>
        </div>
        <button className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded font-bold">
          Register
        </button>
      </form>
      {success && <p className="mt-4">{success}</p>}
    </div>
  );
}