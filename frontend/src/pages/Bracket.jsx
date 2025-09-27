import React, { useEffect, useState } from 'react';
import './Bracket.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com';

export default function Bracket(){
  const [bracket, setBracket] = useState({ semi: [], final: [] });

  async function loadBracket(){
    try {
      const res = await fetch(`${API_URL}/api/bracket`);
      const data = await res.json();
      setBracket(data || { semi: [], final: [] });
    } catch (e) {
      console.error('Failed to load bracket', e);
    }
  }

  useEffect(()=>{ loadBracket(); },[]);

  return (
    <section className="card" style={{margin:'28px 0'}}>
      <h2>Tournament Bracket</h2>
      <div className="bracket-container">
        {/* Semi-final round */}
        <div className="round">
          <h3>Semi Finals</h3>
          {bracket.semi && bracket.semi.length > 0 ? (
            bracket.semi.map(g=>(
              <div className="match" key={g.id}>
                <div className="team">{g.team1} <span>{g.score1}</span></div>
                <div className="team">{g.team2} <span>{g.score2}</span></div>
              </div>
            ))
          ) : (
            <p className="muted">No semi-final games yet</p>
          )}
        </div>

        {/* Final round */}
        <div className="round">
          <h3>Final</h3>
          {bracket.final && bracket.final.length > 0 ? (
            bracket.final.map(g=>(
              <div className="match" key={g.id}>
                <div className="team">{g.team1} <span>{g.score1}</span></div>
                <div className="team">{g.team2} <span>{g.score2}</span></div>
              </div>
            ))
          ) : (
            <p className="muted">No final game yet</p>
          )}
        </div>
      </div>
    </section>
  );
}