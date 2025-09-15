import React, { useEffect, useState } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("Guest");

  const load = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/messages`);
      setMessages(res.data || []);
    } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post(`${API_BASE}/api/messages`, { id: Date.now(), name, text });
    setText("");
    await load();
  };

  return (
    <div className="card max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Leave a Birthday Message</h2>
      <form onSubmit={send} className="flex gap-2">
        <input className="w-40 p-2 rounded bg-gray-800" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="flex-1 p-2 rounded bg-gray-800" placeholder="Write your message..." value={text} onChange={e=>setText(e.target.value)} />
        <button className="btn">Send</button>
      </form>
      <ul className="mt-6 space-y-2">
        {messages.slice().reverse().map((m) => (
          <li key={m.id} className="bg-gray-800 p-3 rounded">
            <strong>{m.name}</strong>: {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
