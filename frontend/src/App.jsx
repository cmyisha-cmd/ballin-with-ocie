import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Tickets from './pages/Tickets';
import BirthdayWall from './pages/BirthdayWall';
import Admin from './pages/Admin';
import Leaderboard from './pages/Leaderboard';
import Bracket from './pages/Bracket'; // ✅ Bracket page

export default function App(){
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="wrap bar header-inner">
          <div className="logo">
            <Link to="/">Ballin' with Ocie</Link>
          </div>
          <nav className={menuOpen ? 'open' : ''}>
            <Link to="/" onClick={()=>setMenuOpen(false)}>Home</Link>
            <Link to="/register" onClick={()=>setMenuOpen(false)}>Register</Link>
            <Link to="/tickets" onClick={()=>setMenuOpen(false)}>Tickets</Link>
            <Link to="/birthdaywall" onClick={()=>setMenuOpen(false)}>Birthday Wall</Link>
            <Link to="/leaderboard" onClick={()=>setMenuOpen(false)}>Leaderboard</Link>
            <Link to="/admin" onClick={()=>setMenuOpen(false)}>Admin</Link>
            <Link to="/bracket" onClick={()=>setMenuOpen(false)}>Bracket</Link> {/* ✅ Menu link */}
          </nav>
          <button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </header>

      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/birthdaywall" element={<BirthdayWall />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/bracket" element={<Bracket />} /> {/* ✅ Bracket route */}
        </Routes>
      </main>
    </>
  );
}
