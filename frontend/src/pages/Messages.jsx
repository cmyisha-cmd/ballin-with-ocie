// frontend/src/pages/Messages.jsx
import { useEffect, useState } from "react";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });

  const fetchMessages = () => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setForm({ name: "", message: "" });
      fetchMessages(); // refresh board
    }
  };

  return (
    <div style={{ background:"#000", minHeight:"calc(100vh - 180px)", color:"#fff", padding:"2rem" }}>
      <h2 style={{ color:"#8A2BE2", textAlign:"center", marginBottom:"1rem" }}>Leave a Birthday Wish 🎉</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth:"600px", margin:"0 auto", marginBottom:"2rem" }}>
        <input type="text" name="name" value={form.name} placeholder="Your Name"
          onChange={handleChange} style={{ width:"100%", marginBottom:"0.5rem", padding:"0.5rem", borderRadius:"6px" }} />
        <textarea name="message" value={form.message} placeholder="Your Message"
          onChange={handleChange} style={{ width:"100%", minHeight:"80px", marginBottom:"0.5rem", padding:"0.5rem", borderRadius:"6px" }} />
        <button type="submit" style={{
          background:"#8A2BE2", color:"#fff", padding:"0.5rem", border:"none", borderRadius:"6px", cursor:"pointer"
        }}>Post</button>
      </form>

      <div style={{ maxWidth:"600px", margin:"0 auto" }}>
        {messages.length === 0 ? <p>No messages yet — be the first! 🎈</p> : 
          messages.map((m, i) => (
            <div key={i} style={{ background:"#111", padding:"1rem", marginBottom:"0.5rem", borderRadius:"6px" }}>
              <strong>{m.name}:</strong> {m.message}
            </div>
        ))}
      </div>
    </div>
  );
}
