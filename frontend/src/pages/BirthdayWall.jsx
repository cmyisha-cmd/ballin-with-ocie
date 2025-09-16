import { useState } from "react";
import MessageCard from "../components/MessageCard";

export default function BirthdayWall() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Happy Birthday Ocie! 🎉", replies: [], reactions: { "👍": 2, "🎂": 1 } },
    { id: 2, text: "Wishing you many more!", replies: [], reactions: { "❤️": 1 } }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [password, setPassword] = useState("");

  const addMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), text: newMessage, replies: [], reactions: {} }]);
      setNewMessage("");
    }
  };

  const handleLogin = () => {
    if (password === "ocie2025") setAdminMode(true);
  };

  return (
    <div style={{ padding:"2rem", background:"#111", color:"#fff", minHeight:"100vh" }}>
      <h2 style={{ fontSize:"40px", color:"#8A2BE2" }}>Birthday Wall</h2>
      {!adminMode && (
        <div style={{ marginBottom:"1rem" }}>
          <input type="password" placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
      <div style={{ marginBottom:"1rem" }}>
        <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Write a birthday message..." />
        <button onClick={addMessage}>Post</button>
      </div>
      {messages.map(msg => (
        <MessageCard key={msg.id} message={msg} setMessages={setMessages} adminMode={adminMode} />
      ))}
    </div>
  );
}