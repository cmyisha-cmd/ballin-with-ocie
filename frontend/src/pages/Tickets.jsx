import React, { useState } from 'react';

const API_URL = "https://ballin-with-ocie.onrender.com";

export default function Tickets() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity }),
      });
      const data = await res.json();
      setMsg(data.message || 'Tickets requested');
      setName(''); setQuantity(1);
    } catch (err) {
      setMsg('Error requesting tickets');
    }
  }

  return (
    <section className="card" style={{ margin: '28px 0' }}>
      <h2>Get Tickets</h2>
      <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
        <input
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          min="1"
          required
        />
        <div className="cta">
          <button className="btn" type="submit">Request Tickets</button>
        </div>
      </form>
      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </section>
  );
}