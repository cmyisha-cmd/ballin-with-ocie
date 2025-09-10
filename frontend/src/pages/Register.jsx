import React,{useState} from 'react';import axios from 'axios';
export default function Register(){
 const[name,setName]=useState('');const[age,setAge]=useState('');const[shoot,setShoot]=useState(false);const[team,setTeam]=useState(false);
 const API=import.meta.env.VITE_API_BASE||'http://localhost:4000';
 async function submit(){const rec={name,age,events:[]};if(shoot)rec.events.push('Shooting');if(team)rec.events.push('Team');await axios.post(API+'/api/players',rec);alert('Registered');}
 return(<div style={{maxWidth:'600px',margin:'20px auto',padding:'0 16px'}}>
 <div style={{background:'#121014',padding:'20px',borderRadius:'12px',border:'2px solid #3a0ca3'}}>
 <h2 style={{color:'#f6c85f'}}>Register</h2>
 <input style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'6px',border:'1px solid #555',background:'#222',color:'#fff'}} placeholder='Name' value={name} onChange={e=>setName(e.target.value)}/>
 <input style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'6px',border:'1px solid #555',background:'#222',color:'#fff'}} placeholder='Age' value={age} onChange={e=>setAge(e.target.value)}/>
 <label><input type='checkbox' checked={shoot} onChange={e=>setShoot(e.target.checked)}/> Shooting Contest</label>
 <label><input type='checkbox' checked={team} onChange={e=>setTeam(e.target.checked)}/> Team Tournament</label>
 <button style={{marginTop:'12px',padding:'10px 14px',background:'#3a0ca3',color:'#fff',border:'none',borderRadius:'6px'}} onClick={submit}>Submit</button>
 </div></div>)}
