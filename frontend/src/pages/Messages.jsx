import { useState, useEffect } from "react";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/messages`)
      .then(res => res.json())
      .then(setMessages);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_BASE}/messages`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, text })
    }).then(() => {
      setMessages([...messages, { name, text }]);
      setName(""); setText("");
    });
  };

  return (
    <div style={{minHeight:"calc(100vh - 180px)", background:"#000", color:"#fff", padding:"2rem", textAlign:"center"}}>
      <h2 style={{fontSize:"40px", fontWeight:900, color:"#8A2BE2"}}>Birthday Messages</h2>
      <form onSubmit={handleSubmit} style={{marginTop:"20px"}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" required />
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Your Message" required />
        <button type="submit" style={{marginTop:"10px"}}>Post</button>
      </form>
      <div style={{marginTop:"20px"}}>
        {messages.map((m,i)=>(<p key={i}><strong>{m.name}:</strong> {m.text}</p>))}
      </div>
    </div>
  );
}