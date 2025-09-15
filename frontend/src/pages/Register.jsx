import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [event, setEvent] = useState('Shooting Contest');

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/players', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, age, event })
    });
    alert("Registration submitted!");
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding:"2rem", color:"#fff" }}>
      <h2>Register</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
      <select value={event} onChange={e => setEvent(e.target.value)}>
        <option>Shooting Contest</option>
        <option>Team Tournament</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
