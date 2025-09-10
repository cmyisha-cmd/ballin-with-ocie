import React,{useState} from 'react';import axios from 'axios';
export default function Tickets(){
 const[name,setName]=useState('');const[count,setCount]=useState('');
 const API=import.meta.env.VITE_API_BASE||'http://localhost:4000';
 async function submit(){await axios.post(API+'/api/tickets',{name,count});alert('Thank you! Your tickets will be available at the Box Office');}
 return(<div style={{maxWidth:'600px',margin:'20px auto',padding:'0 16px'}}>
 <div style={{background:'#121014',padding:'20px',borderRadius:'12px',border:'2px solid #3a0ca3'}}>
 <h2 style={{color:'#f6c85f'}}>Request Tickets</h2>
 <input style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'6px',border:'1px solid #555',background:'#222',color:'#fff'}} placeholder='Name' value={name} onChange={e=>setName(e.target.value)}/>
 <input style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'6px',border:'1px solid #555',background:'#222',color:'#fff'}} placeholder='Tickets' value={count} onChange={e=>setCount(e.target.value)}/>
 <button style={{marginTop:'12px',padding:'10px 14px',background:'#3a0ca3',color:'#fff',border:'none',borderRadius:'6px'}} onClick={submit}>Submit</button>
 </div></div>)}
