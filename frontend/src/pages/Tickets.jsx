import React, { useState } from 'react';

const API_URL = "https://ballin-with-ocie.onrender.com";

export default function Tickets() {
  const [buyer, setBuyer] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyer, quantity }),
      });
      const data = await res.json();
      setMsg(data.message || 'Tickets requested');
      setBuyer(''); setQuantity(1);
    } catch (err) {
      setMsg('Error requesting tickets');
    }
  }

  return (/* keep your JSX form code same */);
}