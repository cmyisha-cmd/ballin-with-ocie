// frontend/src/pages/Register.jsx
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ playerName: "", age: "", shooting: false, team: false });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.playerName.trim() || !form.age) {
      setMessage("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage("✅ Registration submitted successfully!");
        setForm({ playerName: "", age: "", shooting: false, team: false });
      } else {
        setMessage("❌ Failed to register. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again later.");
    }
  };

  return (
    <div style={{
      minHeight:"calc(100vh - 180px)",
      background:"#000",
      color:"#fff",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      padding:"2rem"
    }}>
      <form onSubmit={handleSubmit} style={{
        background:"#111",
        padding:"2rem",
        borderRadius:"12px",
        boxShadow:"0 0 20px rgba(138,43,226,0.4)",
        maxWidth:"480px",
        width:"100%"
      }}>
        <h2 style={{ color:"#8A2BE2", marginBottom:"1rem", textAlign:"center" }}>Player Registration</h2>

        <label style={{ display:"block", marginBottom:"0.5rem" }}>Name*</label>
        <input type="text" name="playerName" value={form.playerName} onChange={handleChange} required
          style={{ width:"100%", padding:"0.5rem", marginBottom:"1rem", borderRadius:"6px" }} />

        <label style={{ display:"block", marginBottom:"0.5rem" }}>Age*</label>
        <input type="number" name="age" value={form.age} onChange={handleChange} required
          style={{ width:"100%", padding:"0.5rem", marginBottom:"1rem", borderRadius:"6px" }} />

        <label style={{ display:"block", margin:"0.5rem 0" }}>
          <input type="checkbox" name="shooting" checked={form.shooting} onChange={handleChange} /> Shooting Contest
        </label>

        <label style={{ display:"block", marginBottom:"1rem" }}>
          <input type="checkbox" name="team" checked={form.team} onChange={handleChange} /> Team Tournament
        </label>

        <button type="submit" style={{
          background:"#8A2BE2",
          color:"#fff",
          padding:"0.75rem",
          border:"none",
          borderRadius:"8px",
          width:"100%",
          fontWeight:"bold",
          cursor:"pointer"
        }}>
          Register
        </button>

        {message && <p style={{ marginTop:"1rem", color:"#E5E5E5", textAlign:"center" }}>{message}</p>}
      </form>
    </div>
  );
}
