import React,{useEffect,useState} from 'react';import axios from 'axios';
export default function Bracket(){
 const[teams,setTeams]=useState([]);const API=import.meta.env.VITE_API_BASE||'http://localhost:4000';
 useEffect(()=>{axios.get(API+'/api/teams').then(r=>setTeams(r.data));},[]);
 return(<div style={{maxWidth:'700px',margin:'20px auto',padding:'0 16px'}}>
 <h2 style={{color:'#f6c85f'}}>Team Bracket</h2>
 {teams.map(t=>(<div key={t.name} style={{background:'#121014',padding:'12px',borderRadius:'12px',border:'2px solid #3a0ca3',marginBottom:'8px'}}>
 <strong style={{color:'#f6c85f'}}>{t.name}</strong>: {t.players.map(p=>p.name).join(', ')}
 </div>))}</div>)}
