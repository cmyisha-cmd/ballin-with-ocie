import { useState } from 'react';

export default function Tickets() {
  const [name, setName] = useState('');
  const [count, setCount] = useState(1);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/tickets', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, count })
    });
    alert("Thank you! Your tickets will be available at the Box Office.");
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding:"2rem", color:"#fff" }}>
      <h2>Get Tickets</h2>
      <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="number" min="1" value={count} onChange={e => setCount(e.target.value)} />
      <button type="submit">Request Tickets</button>
    </form>
  );
}
