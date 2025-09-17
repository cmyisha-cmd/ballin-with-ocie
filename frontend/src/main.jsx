
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Tickets from './pages/Tickets.jsx'
import BirthdayWall from './pages/BirthdayWall.jsx'
import Admin from './pages/Admin.jsx'

function Shell({children}){
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-[#0E0E14] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-primary">Ballin' with Ocie</Link>
          <nav className="flex gap-3 text-sm">
            <Link className="btn" to="/register">Register</Link>
            <Link className="btn" to="/tickets">Get Tickets</Link>
            <Link className="btn" to="/birthday-wall">Birthday Wall</Link>
            <Link className="btn" to="/admin">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10 bg-[#0E0E14]">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-white/60">
          Ballin' with Ocie: 13th Edition · Sept 27, 2025 · 2:00 PM · P.B. Edwards Jr. Gymnasium, 101 Turnberry St, Port Wentworth, GA 31407
        </div>
      </footer>
    </div>
  )
}

function App(){
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/tickets" element={<Tickets/>} />
          <Route path="/birthday-wall" element={<BirthdayWall/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App/>)
