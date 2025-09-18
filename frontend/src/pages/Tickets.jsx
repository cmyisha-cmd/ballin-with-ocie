import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Tickets() {
  const [buyer, setBuyer] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    try {
      console.log("Submitting to:", `${API_URL}/api/tickets`);
      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer, quantity }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('✅ Tickets purchased!');
        setBuyer('');
        setQuantity(1);
      } else {
        setMsg('❌ ' + (data.message || 'Failed'));
      }
    } catch (err) {
      console.error("Tickets error:", err);
      setMsg('❌ Network error');
    }
  }

  return (
    <section className="card" style={{ margin: '28px 0' }}>
      <h2 style={{ marginTop: 0 }}>Request Non-Player Spectator Tickets</h2>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={buyer} onChange={(e) => setBuyer(e.target.value)} />
        <label>Non-player Tickets</label>
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button type="submit">Request</button>
      </form>
      {msg && <p>{msg}</p>}
    </section>
  );
}
