import React, { useEffect, useState } from 'react';

const API_URL = "https://ballin-with-ocie.onrender.com";

export default function Admin(){
  const [pass, setPass] = useState('');
  const [ok, setOk] = useState(false);

  const [players, setPlayers] = useState([]);
  const [shooting, setShooting] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [teams, setTeams] = useState({A:[], B:[]});

  async function loadAll(){
    try{
      const [p,s,t,tm] = await Promise.all([
        fetch(`${API_URL}/api/players`).then(r=>r.json()),
        fetch(`${API_URL}/api/shooting`).then(r=>r.json()),
        fetch(`${API_URL}/api/tickets`).then(r=>r.json()),
        fetch(`${API_URL}/api/teams`).then(r=>r.json())
      ]);
      setPlayers(p||[]); setShooting(s||[]); setTickets(t||[]); setTeams(tm||{A:[],B:[]});
    }catch(e){ console.error(e); }
  }
  useEffect(()=>{ if(ok){ loadAll(); const i=setInterval(loadAll, 8000); return ()=>clearInterval(i) } }, [ok]);

  async function saveScore(id, score, time){
    await fetch(`${API_URL}/api/shooting/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({score:Number(score||0), time}) });
    loadAll();
  }
  async function autoTeams(){
    await fetch(`${API_URL}/api/teams/auto`, { method:'POST', headers:{ 'x-admin-pass': 'ocie2025' } });
    loadAll();
  }
  async function resetData(){
    if(!confirm('This will clear all data. Continue?')) return;
    await fetch(`${API_URL}/api/reset`, { method:'POST', headers:{ 'x-admin-pass': 'ocie2025' } });
    loadAll();
  }

  if(!ok){
    return (
      <section className="card" style={{margin:'28px 0'}}>
        <h2>Admin Login</h2>
        <form onSubmit={(e)=>{ e.preventDefault(); if(pass==='ocie2025') setOk(true); else alert('Wrong password') }}>
          <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} />
          <div className="cta"><button className="btn">Login</button></div>
        </form>
      </section>
    );
  }

  return (
    <section className="grid" style={{margin:'28px 0'}}>
      <div className="card">
        <h3 style={{marginTop:0}}>Shooting Contest</h3>
        {/* table rendering same as before */}
      </div>
      <div className="card"><h3>Teams</h3></div>
      <div className="card"><h3>Tickets</h3></div>
      <div className="card"><h3>Danger Zone</h3></div>
    </section>
  );
}