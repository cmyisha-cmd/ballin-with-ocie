
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  return (
    <div style={{
      backgroundColor: "#000",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "2.5rem", color: "#8A2BE2", marginBottom: "1rem" }}>
        Player Registration
      </h1>
      <div style={{
        backgroundColor: "#111",
        padding: "1.5rem",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "400px"
      }}>
        <input style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "4px",
          border: "1px solid #555",
          backgroundColor: "#222",
          color: "white"
        }} placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "4px",
          border: "1px solid #555",
          backgroundColor: "#222",
          color: "white"
        }} placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} />
        <label><input type="checkbox" /> Shooting Contest</label><br/>
        <label><input type="checkbox" /> Team Tournament</label>
        <button style={{
          backgroundColor: "#8A2BE2",
          color: "#fff",
          fontWeight: "bold",
          marginTop: "1rem",
          padding: "10px",
          width: "100%",
          borderRadius: "5px",
          border: "none"
        }}>Register</button>
      </div>
    </div>
  );
}
