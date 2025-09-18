import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [players, setPlayers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [pRes, tRes, mRes] = await Promise.all([
        fetch(`${API_URL}/api/players`),
        fetch(`${API_URL}/api/tickets`),
        fetch(`${API_URL}/api/messages`)
      ]);

      if (!pRes.ok || !tRes.ok || !mRes.ok) {
        throw new Error('Failed to fetch data from server');
      }

      const [pData, tData, mData] = await Promise.all([
        pRes.json(),
        tRes.json(),
        mRes.json()
      ]);

      setPlayers(pData);
      setTickets(tData);
      setMessages(mData);
      setError('');
    } catch (err) {
      console.error('Admin Dashboard load error:', err);
      setError('❌ Could not load data from server');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(); // initial load
    const interval = setInterval(loadData, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={{ margin: '28px 0', padding: '16px' }}>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={loadData} disabled={loading} style={{ marginBottom: '16px' }}>
        {loading ? 'Refreshing...' : '🔄 Refresh Now'}
      </button>

      <section>
        <h3>Players</h3>
        {players.length === 0 ? (
          <p>No players registered yet.</p>
        ) : (
          <ul>
            {players.map(p => (
              <li key={p.id}>
                {p.name} (Age {p.age}) {p.shooting ? '🏀 Shooting' : ''} {p.team ? '👥 Team' : ''}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Tickets</h3>
        {tickets.length === 0 ? (
          <p>No tickets purchased yet.</p>
        ) : (
          <ul>
            {tickets.map(t => (
              <li key={t.id}>{t.buyer} — {t.quantity} ticket(s)</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Messages</h3>
        {messages.length === 0 ? (
          <p>No messages posted yet.</p>
        ) : (
          <ul>
            {messages.map(m => (
              <li key={m.id}><b>{m.author}</b>: {m.text}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
