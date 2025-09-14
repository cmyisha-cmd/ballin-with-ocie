import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "MISSING";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post(`${API_BASE}/api/messages`, { name: "Guest", text });
    setText("");
    fetchMessages();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gray-900 p-6 rounded-2xl text-white">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Leave a Birthday Message</h2>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800"
          placeholder="Write your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="bg-purple-700 hover:bg-purple-600 px-4 rounded">Send</button>
      </form>
      <ul className="mt-6 space-y-2">
        {messages.map((m) => (
          <li key={m.id} className="bg-gray-800 p-3 rounded">
            <strong>{m.name}</strong>: {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}