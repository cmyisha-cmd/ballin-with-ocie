import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com';

export default function ApiCheck(){
  const [status, setStatus] = useState('checking…');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/messages`);
        setStatus(`API_URL=${API_URL} • /api/messages → ${r.status}`);
      } catch (e) {
        setStatus(`API_URL=${API_URL} • fetch failed`);
      }
    })();
  }, []);

  return (
    <div className="card" style={{margin:'28px 0', padding:'16px'}}>
      <h3>API Check</h3>
      <pre>{status}</pre>
    </div>
  );
}
