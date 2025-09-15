import React, { useState } from 'react';
export default function Register() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlayers([...players, { name, age }]);
    setName('');
    setAge('');
  };

  return (
    <div style={{padding:'2rem'}}>
      <h2>Register as a Player</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" required />
        <button type="submit">Submit</button>
      </form>
      <h3>Registered Players</h3>
      <ul>{players.map((p, i) => <li key={i}>{p.name} - {p.age}</li>)}</ul>
    </div>
  );
}