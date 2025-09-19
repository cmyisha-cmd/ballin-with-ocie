import React, { useEffect, useState } from 'react';

const API_URL = "https://ballin-with-ocie.onrender.com";

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
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (/* keep your table rendering code same */);
}