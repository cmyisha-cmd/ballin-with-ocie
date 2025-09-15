import React, { useState } from 'react';
export default function Messages() {
  const [messages, setMessages] = useState([{name:'Sample Guest', text:'Happy Birthday!'}]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, { name, text }]);
    setName('');
    setText('');
  };

  return (
    <div style={{padding:'2rem'}}>
      <h2>Leave a Birthday Message</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" required />
        <button type="submit">Post</button>
      </form>
      <ul>{messages.map((m, i) => <li key={i}><strong>{m.name}</strong>: {m.text}</li>)}</ul>
    </div>
  );
}