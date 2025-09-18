import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [form, setForm] = useState({ name: '', age: '', shooting: false, team: false });
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    try {
      console.log("Submitting to:", `${API_URL}/api/register`);
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('✅ Registered!');
        setForm({ name: '', age: '', shooting: false, team: false });
      } else {
        setMsg('❌ ' + (data.message || 'Failed'));
      }
    } catch (err) {
      console.error("Register error:", err);
      setMsg('❌ Network error');
    }
  }

  return (
    <section className="card" style={{ margin: '28px 0' }}>
      <h2 style={{ marginTop: 0 }}>Register as a Player</h2>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>Age</label>
        <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        <label>
          <input
            type="checkbox"
            checked={form.shooting}
            onChange={(e) => setForm({ ...form, shooting: e.target.checked })}
          />
          Shooting Contest
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.team}
            onChange={(e) => setForm({ ...form, team: e.target.checked })}
          />
          Join a Team
        </label>
        <button type="submit">Submit</button>
      </form>
      {msg && <p>{msg}</p>}
    </section>
  );
}
