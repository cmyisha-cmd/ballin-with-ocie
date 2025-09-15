// frontend/src/pages/Tickets.jsx
import { useState } from "react";

export default function Tickets() {
  const [form, setForm] = useState({ name: "", count: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.count) {
      setMessage("Please provide your name and number of tickets.");
      return;
    }

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage("✅ Thank you! Your tickets will be available at the Box Office.");
        setForm({ name: "", count: "" });
      } else {
        setMessage("❌ Failed to submit request. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Please try again later.");
    }
  };

  return (
    <div style={{ background:"#000", minHeight:"calc(100vh - 180px)", color:"#fff", display:"flex", justifyContent:"center", alignItems:"center" }}>
      <form onSubmit={handleSubmit} style={{
        background:"#111", padding:"2rem", borderRadius:"12px", boxShadow:"0 0 20px rgba(138,43,226,0.4)",
        maxWidth:"480px", width:"100%"
      }}>
        <h2 style={{ color:"#8A2BE2", marginBottom:"1rem", textAlign:"center" }}>Spectator Tickets</h2>
        <label style={{ display:"block", marginBottom:"0.5rem" }}>Name*</label>
        <input type="text" name="name" value={form.name} onChange={handleChange}
          style={{ width:"100%", padding:"0.5rem", marginBottom:"1rem", borderRadius:"6px" }} />
        <label style={{ display:"block", marginBottom:"0.5rem" }}>Number of Non-Player Tickets*</label>
        <input type="number" name="count" value={form.count} onChange={handleChange}
          style={{ width:"100%", padding:"0.5rem", marginBottom:"1rem", borderRadius:"6px" }} />
        <button type="submit" style={{
          background:"#8A2BE2", color:"#fff", padding:"0.75rem", border:"none",
          borderRadius:"8px", width:"100%", fontWeight:"bold", cursor:"pointer"
        }}>
          Request Tickets
        </button>
        {message && <p style={{ marginTop:"1rem", textAlign:"center" }}>{message}</p>}
      </form>
    </div>
  );
}
