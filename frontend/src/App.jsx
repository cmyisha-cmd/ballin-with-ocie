import React, { useState } from 'react' 
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Tickets from './pages/Tickets'
import BirthdayWall from './pages/BirthdayWall'
import Admin from './pages/Admin'
import Leaderboard from './pages/Leaderboard'

export default function App(){
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Ticker messages here
  const tickerMessages = [
    "P.B. Edwards Jr. Gymnasium • Sept 27, 2025 • 2:00 PM",
    "Doors open at 1:00 PM — Arrive early!",
    "Register now for the Shooting Contest 🏀",
    "Happy 13th Birthday Ocie! 🎉"
  ];

  return (
    <>
      <header className="site-header">
        <div className="wrap bar header-inner">

          {/* ✅ Logo on the left */}
          <div className="brand">
            <Link to="/" onClick={()=>setMenuOpen(false)}>
              <img 
                src="/ocie-logo.png" 
                alt="Ballin' With Ocie: 13th Edition" 
                style={{height:'60px', width:'auto'}}
              />
            </Link>
          </div>

          {/* Hamburger (mobile) */}
          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {/* Nav links */}
          <nav className={menuOpen ? 'open' : ''}>
            <Link to="/" onClick={()=>setMenuOpen(false)}>Home</Link>
            <Link to="/register" onClick={()=>setMenuOpen(false)}>Register</Link>
            <Link to="/tickets" onClick={()=>setMenuOpen(false)}>Get Tickets</Link>
            <Link to="/birthday" onClick={()=>setMenuOpen(false)}>Birthday Wall</Link>
            <Link to="/leaderboard" onClick={()=>setMenuOpen(false)}>Leaderboard</Link>
            <Link to="/admin" onClick={()=>setMenuOpen(false)}>Admin</Link>
          </nav>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}

      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/tickets" element={<Tickets/>} />
          <Route path="/birthday" element={<BirthdayWall/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>

      {/* ✅ ESPN-style ticker footer */}
      <footer>
        <div className="ticker">
          <div className="ticker__wrap">
            {tickerMessages.map((msg, i) => (
              <div key={i} className="ticker__item">{msg}</div>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
