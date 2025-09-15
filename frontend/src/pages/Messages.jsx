import { useState } from "react";
export default function Messages() {
  const [messages, setMessages] = useState([{name:"Fan1", text:"Happy Birthday Ocie!"},{name:"Fan2", text:"Let's go!"}]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, {name, text}]);
    setName(""); setText("");
  };

  return (
    <div style={{padding:"2rem"}}>
      <h2 style={{color:"#8A2BE2"}}>Birthday Message Board</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Your Message" value={text} onChange={e => setText(e.target.value)} required />
        <button type="submit">Post</button>
      </form>
      <ul>
        {messages.map((m, i) => <li key={i}><b>{m.name}:</b> {m.text}</li>)}
      </ul>
    </div>
  );
}