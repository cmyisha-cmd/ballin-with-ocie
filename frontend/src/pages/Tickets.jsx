import { useState } from "react";

export default function Tickets(){
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState([
    { name:"Ava Thompson", tickets:2 },
    { name:"Liam Carter", tickets:4 },
    { name:"Maya Lee", tickets:3 },
  ]);

  const submit = (e)=>{
    e.preventDefault();
    if(!name || !count) { alert("Enter name and number of tickets."); return; }
    setRequests(r=>[{ name, tickets:Number(count) }, ...r]);
    setSubmitted(true);
    setTimeout(()=>setSubmitted(false), 2500);
    setName("");
    setCount("");
  };

  return (
    <div style={{padding:"24px"}}>
      <h2 style={{color:"#8A2BE2", fontSize:"34px", fontWeight:900, marginBottom:12}}>Get Tickets</h2>
      {submitted && <div style={{background:"#0f1f0f", color:"#7CFFA7", border:"1px solid #1b7a3a", padding:"10px 12px", borderRadius:8, marginBottom:12}}>Thank you! Your tickets will be available at the Box Office.</div>}
      <form onSubmit={submit} style={{background:"#111", padding:16, borderRadius:12, maxWidth:480}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" style={inputStyle}/>
        <input value={count} onChange={e=>setCount(e.target.value)} placeholder="Number of Tickets" type="number" min="1" style={inputStyle}/>
        <button type="submit" style={buttonPrimary}>Request</button>
      </form>

      <h3 style={{marginTop:24, marginBottom:10, color:"#cfcfcf"}}>Recent Ticket Requests</h3>
      <ul style={{listStyle:"none", padding:0, margin:0, maxWidth:600}}>
        {requests.map((r,i)=>(
          <li key={i} style={{background:"#151515", border:"1px solid #2a2a2a", padding:"10px 12px", borderRadius:10, marginBottom:8}}>
            <strong>{r.name}</strong> — {r.tickets} ticket{r.tickets>1?"s":""}
          </li>
        ))}
      </ul>
    </div>
  );
}

const inputStyle = { width:"100%", padding:"10px 12px", marginBottom:10, borderRadius:8, border:"1px solid #333", background:"#1c1c1c", color:"#fff" };
const buttonPrimary = { background:"#8A2BE2", color:"#fff", border:"none", borderRadius:8, padding:"10px 12px", marginTop:10, cursor:"pointer", fontWeight:700 };
