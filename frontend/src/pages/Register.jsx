import React, { useState } from 'react';

const API_URL = "https://ballin-with-ocie.onrender.com";

export default function Register() {
  const [form, setForm] = useState({ name: '', age: '', shooting: false, team: false });
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMsg(data.message || 'Registered');
      setForm({ name: '', age: '', shooting: false, team: false });
    } catch (err) {
      setMsg('Error registering');
    }
  }

  return (/* same JSX as before, just unchanged */);
}
