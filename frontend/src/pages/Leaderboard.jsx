import React,{useEffect,useState} from 'react';import axios from 'axios';
export default function Leaderboard(){
 const[players,setPlayers]=useState([]);
 const API=import.meta.env.VITE_API_BASE||'http://localhost:4000';
 useEffect(()=>{async function fetchData(){const res=await axios.get(API+'/api/shooting');setPlayers(res.data);}fetchData();const interval=setInterval(fetchData,5000);return()=>clearInterval(interval);},[]);
 return(<div style={{maxWidth:'700px',margin:'20px auto',padding:'0 16px'}}>
 <h2 style={{color:'#f6c85f'}}>Shooting Contest Leaderboard</h2>
 <div style={{background:'#000',border:'3px solid #3a0ca3',borderRadius:'12px',marginTop:'20px'}}>
 {players.map((p,i)=>(<div key={p.id} style={{display:'flex',justifyContent:'space-between',padding:'12px 16px',background:i===0?'linear-gradient(90deg,#3a0ca3,#5f0f40)':'#000',color:i===0?'#f6c85f':'#fff'}}>
 <span>{i+1}</span><span>{p.name}</span><span>{p.score}</span><span>{p.time}s</span>{i===0&&<span>🏆</span>}</div>))}
 </div></div>)}
