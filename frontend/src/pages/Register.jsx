import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Player Registered: ${name}, Age: ${age}`);
  };

  return (
    <div style={{padding:"2rem"}}>
      <h2>Register for Shooting Contest</h2>
      <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",maxWidth:"400px"}}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={{marginBottom:"1rem"}} />
        <input placeholder="Age" value={age} onChange={e => setAge(e.target.value)} style={{marginBottom:"1rem"}} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}