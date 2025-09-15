import { useState } from "react";

export default function Tickets() {
  const [name, setName] = useState("");
  const [tickets, setTickets] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_BASE}/tickets`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, tickets })
    }).then(() => {
      alert("Thank you! Your tickets will be available at the Box Office.");
      setName(""); setTickets("");
    });
  };

  return (
    <div style={{minHeight:"calc(100vh - 180px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"2rem", background:"#000", color:"#fff"}}>
      <h2 style={{fontSize:"40px", fontWeight:900, color:"#8A2BE2"}}>Get Tickets</h2>
      <form onSubmit={handleSubmit} style={{marginTop:"20px", maxWidth:"400px", width:"100%", textAlign:"left"}}>
        <label style={{display:"block", marginBottom:"8px"}}>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} required style={{width:"100%", marginBottom:"12px"}} />
        <label style={{display:"block", marginBottom:"8px"}}>Tickets</label>
        <input type="number" value={tickets} onChange={e=>setTickets(e.target.value)} required style={{width:"100%", marginBottom:"12px"}} />
        <button type="submit" style={{padding:"10px 16px", background:"#8A2BE2", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer"}}>Submit</button>
      </form>
    </div>
  );
}