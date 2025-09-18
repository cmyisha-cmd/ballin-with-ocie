import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [pass, setPass] = useState('');
  const [ok, setOk] = useState(false);

  const [players, setPlayers] = useState([]);
  const [shooting, setShooting] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [teams, setTeams] = useState({ A: [], B: [] });

  async function loadAll() {
    try {
      const [p, s, t, tm] = await Promise.all([
        fetch(`${API_URL}/api/players`).then(r => r.json()),
        fetch(`${API_URL}/api/shooting`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/api/tickets`).then(r => r.json()),
        fetch(`${API_URL}/api/teams`).then(r => r.json()).catch(() => ({ A: [], B: [] }))
      ]);
      setPlayers(p || []);
      setShooting(s || []);
      setTickets(t || []);
      setTeams(tm || { A: [], B: [] });
    } catch (err) {
      console.error('Admin loadAll error:', err);
    }
  }

  useEffect(() => {
    if (ok) {
      loadAll();
      const i = setInterval(loadAll, 8000);
      return () => clearInterval(i);
    }
  }, [ok]);

  async function saveScore(id, score, time) {
    try {
      await fetch(`${API_URL}/api/shooting/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, time })
      });
      loadAll();
    } catch (err) {
      console.error('Save score error:', err);
    }
  }

  async function login() {
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setOk(true);
      } else {
        alert('Invalid password');
      }
    } catch (err) {
      alert('Login failed');
    }
  }

  if (!ok) {
    return (
      <div className="card">
        <h2>Admin Login</h2>
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Enter admin password"
        />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div className="card" style={{ margin: '28px 0', padding: '16px' }}>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Players</h3>
        <ul>
          {players.map(p => (
            <li key={p.id}>
              {p.name} (Age {p.age}) {p.shooting ? '🏀 Shooting' : ''} {p.team ? '👥 Team' : ''}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Tickets</h3>
        <ul>
          {tickets.map(t => (
            <li key={t.id}>{t.buyer} — {t.quantity} ticket(s)</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Shooting Scores</h3>
        <ul>
          {shooting.map(s => (
            <li key={s.id}>
              {s.name} — Score: {s.score}, Time: {s.time}{' '}
              <button onClick={() => saveScore(s.id, s.score + 1, s.time)}>+1</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Teams</h3>
        <div>
          <b>Team A:</b> {teams.A.join(', ') || 'No players'}
        </div>
        <div>
          <b>Team B:</b> {teams.B.join(', ') || 'No players'}
        </div>
      </section>
    </div>
  );
}
