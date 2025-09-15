import { useState } from "react";
export default function Register() {
  const [form, setForm] = useState({ name: "", age: "", shooting: false, team: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{padding:"2rem"}}>
      <h2 style={{color:"#8A2BE2"}}>Player Registration</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /><br/><br/>
          <input placeholder="Age" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required /><br/><br/>
          <label><input type="checkbox" checked={form.shooting} onChange={e => setForm({...form, shooting: e.target.checked})}/> Shooting Contest</label><br/>
          <label><input type="checkbox" checked={form.team} onChange={e => setForm({...form, team: e.target.checked})}/> Team Tournament</label><br/><br/>
          <button type="submit">Register</button>
        </form>
      ) : (
        <p>✅ Registration submitted for {form.name}!</p>
      )}
    </div>
  );
}