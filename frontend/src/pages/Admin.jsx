import React,{useState} from 'react';import axios from 'axios';
export default function Admin(){
 const[user,setUser]=useState('');const[pass,setPass]=useState('');const[token,setToken]=useState('');
 const API=import.meta.env.VITE_API_BASE||'http://localhost:4000';
 async function login(){const r=await axios.post(API+'/api/admin/login',{user,pass});setToken(r.data.token);alert('Logged in');}
 async function assign(){await axios.post(API+'/api/teams/assign',{teamCount:2},{headers:{Authorization:'Bearer '+token}});alert('Teams Assigned');}
 return(<div style={{maxWidth:'600px',margin:'20px auto',padding:'0 16px'}}>
 <div style={{background:'#121014',padding:'20px',borderRadius:'12px',border:'2px solid #3a0ca3'}}>
 <h2 style={{color:'#f6c85f'}}>Admin Login</h2>
 <input style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'6px',border:'1px solid #555',background:'#222',color:'#fff'}} placeholder='User' value={user} onChange={e=>setUser(e.target.value)}/>
 <input type='password' style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'6px',border:'1px solid #555',background:'#222',color:'#fff'}} placeholder='Password' value={pass} onChange={e=>setPass(e.target.value)}/>
 <button style={{marginTop:'12px',padding:'10px 14px',background:'#3a0ca3',color:'#fff',border:'none',borderRadius:'6px'}} onClick={login}>Login</button>
 {token && <button style={{marginTop:'12px',padding:'10px 14px',background:'#5f0f40',color:'#fff',border:'none',borderRadius:'6px'}} onClick={assign}>Auto Assign Teams</button>}
 </div></div>)}
