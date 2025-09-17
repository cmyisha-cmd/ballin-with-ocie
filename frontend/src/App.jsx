import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Tickets from './pages/Tickets'
import BirthdayWall from './pages/BirthdayWall'
import Admin from './pages/Admin'

export default function App(){
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
          <nav>
            <Link to="/">Home</Link>
            <Link to="/register">Register</Link>
            <Link to="/tickets">Get Tickets</Link>
            <Link to="/birthday">Birthday Wall</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/tickets" element={<Tickets/>} />
          <Route path="/birthday" element={<BirthdayWall/>} />
          <Route path="/admin" element={<Admin/>} />
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
