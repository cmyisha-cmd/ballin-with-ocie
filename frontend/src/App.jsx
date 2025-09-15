import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Tickets from './pages/Tickets.jsx';
import Messages from './pages/Messages.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <header style={{background:'#111', padding:'1rem', display:'flex', justifyContent:'space-around'}}>
        <Link to="/" style={{color:'#8A2BE2'}}>Home</Link>
        <Link to="/register" style={{color:'#8A2BE2'}}>Register</Link>
        <Link to="/tickets" style={{color:'#8A2BE2'}}>Tickets</Link>
        <Link to="/messages" style={{color:'#8A2BE2'}}>Messages</Link>
        <Link to="/admin" style={{color:'#8A2BE2'}}>Admin</Link>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
