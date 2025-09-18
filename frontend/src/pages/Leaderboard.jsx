import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function parseTime(timeStr) {
  if (!timeStr) return Infinity;
  const [mm, ss] = timeStr.split(':').map(n => parseInt(n, 10));
  return (mm || 0) * 60 + (ss || 0);
}

export default function Leaderboard() {
  const [shooting, setShooting] = useState([]);

  async function loadData() {
    try {
      const res = await fetch(`${API_URL}/api/shooting`);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();
      // sort by score (desc), then time (asc)
      const sorted = [...data].sort((a, b) => {
        if ((b.score || 0) !== (a.score || 0)) {
          return (b.score || 0) - (a.score || 0);
        }
        return parseTime(a.time) - parseTime(b.time);
      });
      setShooting(sorted);
    } catch (err) {
      console.error('Leaderboard load error:', err);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="card" style={{ margin: '28px 0', padding: '16px' }}>
      <h2>Shooting Contest Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Time (mm:ss)</th>
          </tr>
        </thead>
        <tbody>
          {shooting.length === 0 ? (
            <tr><td colSpan="4" className="muted">No shooting entries yet.</td></tr>
          ) : (
            shooting.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.score || 0}</td>
                <td>{p.time || '00:00'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
