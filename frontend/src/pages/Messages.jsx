import { useState, useEffect } from 'react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  async function fetchMessages() {
    const res = await fetch('/api/messages');
    const data = await res.json();
    setMessages(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/messages', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, text })
    });
    setText('');
    fetchMessages();
  }

  useEffect(() => { fetchMessages(); }, []);

  return (
    <div style={{ padding:"2rem", color:"#fff" }}>
      <h2>Leave a Birthday Wish</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
        <textarea placeholder="Your Message" value={text} onChange={e => setText(e.target.value)} required />
        <button type="submit">Send</button>
      </form>
      <div style={{marginTop:"1rem"}}>
        {messages.map((m, i) => (
          <div key={i} style={{background:"#222", padding:"0.5rem", marginBottom:"0.5rem"}}>
            <strong>{m.name}:</strong> {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}
