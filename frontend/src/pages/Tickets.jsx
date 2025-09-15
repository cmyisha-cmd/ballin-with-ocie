import React, { useState } from 'react';
export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [name, setName] = useState('');
  const [count, setCount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTickets([...tickets, { name, count }]);
    setName('');
    setCount('');
  };

  return (
    <div style={{padding:'2rem'}}>
      <h2>Get Tickets</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input value={count} onChange={(e) => setCount(e.target.value)} placeholder="Number of Tickets" required />
        <button type="submit">Request</button>
      </form>
      <h3>Requested Tickets</h3>
      <ul>{tickets.map((t, i) => <li key={i}>{t.name} - {t.count} tickets</li>)}</ul>
    </div>
  );
}