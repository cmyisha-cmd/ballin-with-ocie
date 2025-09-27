import React, { useEffect, useState } from 'react';
import './Bracket.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://ballin-with-ocie.onrender.com';

export default function Bracket(){
  const [data, setData] = useState({});

  async function load(){
    const res = await fetch(`${API_URL}/api/bracket`);
    const json = await res.json();
    setData(json || {});
  }

  useEffect(()=>{
    load();
    const id = setInterval(load, 5000);
    return ()=>clearInterval(id);
  },[]);

  const semi = data.semi || [];
  const final = data.final || [];

  return (
    <section className="card bracket-container" style={{margin:'28px 0'}}>
      <h2>Tournament Bracket</h2>

      {semi.length === 2 && final.length === 1 && (
        <div className="bracket">
          <div className="round round-semis">
            {semi.map(g=>(
              <div className="match" key={g.id}>
                <div className="team">{g.team1 || 'TBD'} <span>{g.score1}</span></div>
                <div className="team">{g.team2 || 'TBD'} <span>{g.score2}</span></div>
              </div>
            ))}
          </div>
          <div className="round round-final">
            {final.map(g=>(
              <div className="match" key={g.id}>
                <div className="team">{g.team1 || 'TBD'} <span>{g.score1}</span></div>
                <div className="team">{g.team2 || 'TBD'} <span>{g.score2}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {semi.length === 0 && final.length === 1 && (
        <div className="bracket">
          <div className="round round-final">
            {final.map(g=>(
              <div className="match" key={g.id}>
                <div className="team">{g.team1 || 'TBD'} <span>{g.score1}</span></div>
                <div className="team">{g.team2 || 'TBD'} <span>{g.score2}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {final.length === 1 && final[0].score1 !== final[0].score2 && (
        <div className="champion" style={{marginTop:20, fontWeight:'bold', fontSize:'1.5em', color:'purple'}}>
          🏆 Champion: {final[0].score1 > final[0].score2 ? final[0].team1 : final[0].team2}
        </div>
      )}

      {semi.length===0 && final.length===0 && (
        <p className="muted">No bracket yet. (Admin: auto-assign teams, then generate bracket.)</p>
      )}
    </section>
  );
}