import React,{useState,useEffect} from 'react';import axios from 'axios';
export default function Messages(){
 const[messages,setMessages]=useState([]);const[text,setText]=useState('');const[name,setName]=useState('');
 const API=import.meta.env.VITE_API_BASE||'http://localhost:4000';
 async function load(){const res=await axios.get(API+'/api/messages');setMessages(res.data);}useEffect(()=>{load();},[]);
 async function submit(){await axios.post(API+'/api/messages',{name,text});setName('');setText('');load();}
 return(<div style={{maxWidth:'700px',margin:'20px auto',padding:'0 16px'}}>
 <h2 style={{color:'#f6c85f'}}>Birthday Messages</h2>
 {messages.map(m=>(<div key={m.id} style={{background:'#121014',padding:'12px',borderRadius:'12px',border:'2px solid #3a0ca3',marginBottom:'8px'}}>
 <strong>{m.name}:</strong> {m.text}
 {m.replies&&m.replies.map((r,i)=>(<div key={i} style={{marginLeft:'20px',color:'#bdbdbd'}}>- {r.name}: {r.text}</div>))}
 </div>))}
 <input style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'6px',border:'1px solid #555',background:'#222',color:'#fff'}} placeholder='Your name' value={name} onChange={e=>setName(e.target.value)}/>
 <textarea style={{width:'100%',padding:'10px',margin:'8px 0',borderRadius:'6px',border:'1px solid #555',background:'#222',color:'#fff'}} placeholder='Write a message' value={text} onChange={e=>setText(e.target.value)}/>
 <button style={{marginTop:'12px',padding:'10px 14px',background:'#3a0ca3',color:'#fff',border:'none',borderRadius:'6px'}} onClick={submit}>Send</button>
 </div>)}
