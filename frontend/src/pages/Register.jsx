import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [shooting, setShooting] = useState(false);
  const [tourney, setTourney] = useState(false);
  const [players, setPlayers] = useState([
    { name:"Ocie Johnson", age:13, events:["Shooting Contest","Team Tournament"] },
    { name:"Jaylen Rivers", age:14, events:["Shooting Contest"] },
    { name:"Chris Dean", age:12, events:["Team Tournament"] },
  ]);
  const [saved, setSaved] = useState(false);
  const nav = useNavigate();

  const submit = (e)=>{
    e.preventDefault();
    const ev = [];
    if (shooting) ev.push("Shooting Contest");
    if (tourney) ev.push("Team Tournament");
    if(!name || !age || ev.length===0){ alert("Please enter name, age, and select at least one event."); return; }
    setPlayers(p=>[{ name, age: Number(age), events: ev }, ...p]);
    setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  }

  return (
    <div style={{padding:"24px"}}>
      <h2 style={{color:"#8A2BE2", fontSize:"34px", fontWeight:900, marginBottom:12}}>Player Registration</h2>
      {saved && <div style={{background:"#103d1a", color:"#6CFFA7", border:"1px solid #1b7a3a", padding:"10px 12px", borderRadius:8, marginBottom:12}}>✅ Player Registered!</div>}
      <form onSubmit={submit} style={{background:"#111", padding:16, borderRadius:12, maxWidth:480}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" style={inputStyle}/>
        <input value={age} onChange={e=>setAge(e.target.value)} placeholder="Age" type="number" style={inputStyle}/>
        <label style={labelStyle}><input checked={shooting} onChange={()=>setShooting(s=>!s)} type="checkbox"/> <span>Shooting Contest</span></label>
        <label style={labelStyle}><input checked={tourney} onChange={()=>setTourney(t=>!t)} type="checkbox"/> <span>Team Tournament</span></label>
        <button type="submit" style={buttonPrimary}>Register</button>
      </form>

      <h3 style={{marginTop:24, marginBottom:10, color:"#cfcfcf"}}>Sample Registered Players</h3>
      <div style={{display:"grid", gap:10, maxWidth:720}}>
        {players.map((p,i)=>(
          <div key={i} style={{background:"#151515", border:"1px solid #2a2a2a", padding:"12px 14px", borderRadius:10}}>
            <strong>{p.name}</strong> — Age {p.age}
            <div style={{color:"#bdbdbd", marginTop:6, fontSize:14}}>Events: {p.events.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { width:"100%", padding:"10px 12px", marginBottom:10, borderRadius:8, border:"1px solid #333", background:"#1c1c1c", color:"#fff" };
const labelStyle = { display:"flex", alignItems:"center", gap:8, margin:"6px 0", color:"#ddd" };
const buttonPrimary = { background:"#8A2BE2", color:"#fff", border:"none", borderRadius:8, padding:"10px 12px", marginTop:10, cursor:"pointer", fontWeight:700 };
