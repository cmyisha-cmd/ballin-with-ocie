import React, { useState } from "react";
export default function Register() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [shooting, setShooting] = useState(false);
  const [team, setTeam] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({name, age, shooting, team})
    });
    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div style={{color:"#fff", padding:"2rem"}}>
      <h2>Register Player</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Age" value={age} onChange={e=>setAge(e.target.value)} />
      <label><input type="checkbox" checked={shooting} onChange={e=>setShooting(e.target.checked)} /> Shooting Contest</label>
      <label><input type="checkbox" checked={team} onChange={e=>setTeam(e.target.checked)} /> Team Play</label>
      <button onClick={submit}>Submit</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}