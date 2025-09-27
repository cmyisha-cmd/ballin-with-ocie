import React, { useEffect, useState } from 'react';

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
    <section className="card" style={{margin:'28px 0'}}>
      <h2>Bracket</h2>

      {semi.length>0 && (
        <>
          <h3>Semifinals</h3>
          <ul>
            {semi.map(g=>(
              <li key={g.id}>
                Game {g.game_no}: {g.team1 || 'TBD'} vs {g.team2 || 'TBD'}
                {' '}— Score: {g.score1} : {g.score2}
              </li>
            ))}
          </ul>
        </>
      )}

      {final.length>0 && (
        <>
          <h3>Final</h3>
          <ul>
            {final.map(g=>(
              <li key={g.id}>
                Final: {g.team1 || 'TBD'} vs {g.team2 || 'TBD'}
                {' '}— Score: {g.score1} : {g.score2}
              </li>
            ))}
          </ul>

          {(() => {
            const g = final[0];
            if(g.score1 != null && g.score2 != null && g.score1 !== g.score2){
              const champion = g.score1 > g.score2 ? g.team1 : g.team2;
              return (
                <div style={{marginTop:12, fontWeight:'bold', fontSize:'1.2em', color:'purple'}}>
                  🏆 Champion: Team {champion}
                </div>
              );
            }
            return null;
          })()}
        </>
      )}

      {semi.length===0 && final.length===0 && (
        <p className="muted">No bracket yet. (Admin: auto-assign teams, then generate bracket.)</p>
      )}
    </section>
  );
}
