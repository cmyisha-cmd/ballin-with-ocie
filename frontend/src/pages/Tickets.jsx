import { useState } from "react";
export default function Tickets() {
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{padding:"2rem"}}>
      <h2 style={{color:"#8A2BE2"}}>Get Tickets</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required /><br/><br/>
          <input type="number" placeholder="Number of Tickets" value={count} onChange={e => setCount(e.target.value)} required /><br/><br/>
          <button type="submit">Request</button>
        </form>
      ) : (
        <p>🎟 Thank you {name}! Your {count} tickets will be available at the Box Office.</p>
      )}
    </div>
  );
}