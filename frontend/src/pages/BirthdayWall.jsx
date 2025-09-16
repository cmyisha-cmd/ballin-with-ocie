
import { useState } from 'react';

export default function BirthdayWall() {
  const [messages, setMessages] = useState([{ id:1, name:"Sam", text:"Happy Birthday Ocie! 🎉"}]);
  const [newMessage, setNewMessage] = useState("");
  const [name, setName] = useState("");

  const addMessage = () => {
    setMessages([...messages, {id:Date.now(), name, text:newMessage}]);
    setNewMessage("");
    setName("");
  };

  return (
    <div style={{padding:"2rem", background:"#fefefe"}}>
      <h2>Birthday Wall</h2>
      {messages.map(msg => (
        <div key={msg.id} style={{borderBottom:"1px solid #ccc", marginBottom:"1rem"}}>
          <strong>{msg.name}</strong>: {msg.text}
        </div>
      ))}
      <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
      <textarea placeholder="Write your message..." value={newMessage} onChange={e=>setNewMessage(e.target.value)} />
      <button onClick={addMessage}>Post Message</button>
    </div>
  );
}
