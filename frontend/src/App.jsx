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

  return (
    <>
      <header>
        <div className="wrap bar">
          <div className="brand">
            <div className="ball"></div>
            <div>
              <div style={{fontSize:12, opacity:.8}}>Ballin' with Ocie</div>
              <div style={{fontSize:18, letterSpacing:1}}>13th Edition</div>
            </div>
          </div>

          {/* Hamburger button (mobile only) */}
          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {/* Nav menu */}
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

      {/* ✅ Overlay for mobile menu */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}

      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/tickets" element={<Tickets/>} />
          <Route path="/birthday" element={<BirthdayWall/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/api-check" element={<ApiCheck/>} />
        </Routes>
      </main>

      <footer>
        <div className="wrap" style={{padding:'18px 0', display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap'}}>
          <div>© 2025 Ballin' with Ocie</div>
          <div className="muted">P.B. Edwards Jr. Gymnasium • Sept 27, 2025 • 2:00 PM</div>
        </div>
      </footer>
    </>
  )
}
