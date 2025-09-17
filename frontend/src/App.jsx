import React from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Tickets from './pages/Tickets.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import BirthdayWall from './pages/BirthdayWall.jsx'
import Admin from './pages/Admin.jsx'

const Nav = () => (
  <header className="sticky top-0 z-40 backdrop-blur bg-black/70 border-b border-white/10">
    <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-black text-xl text-nbaAccent">Ballin’ with Ocie</Link>
      <div className="flex items-center gap-4 text-sm">
        <NavLink to="/" className={({isActive})=>isActive?'text-nbaAccent':'text-zinc-300 hover:text-white'}>Home</NavLink>
        <NavLink to="/register" className={({isActive})=>isActive?'text-nbaAccent':'text-zinc-300 hover:text-white'}>Register</NavLink>
        <NavLink to="/tickets" className={({isActive})=>isActive?'text-nbaAccent':'text-zinc-300 hover:text-white'}>Get Tickets</NavLink>
        <NavLink to="/leaderboard" className={({isActive})=>isActive?'text-nbaAccent':'text-zinc-300 hover:text-white'}>Leaderboard</NavLink>
        <NavLink to="/messages" className={({isActive})=>isActive?'text-nbaAccent':'text-zinc-300 hover:text-white'}>Birthday Wall</NavLink>
        <NavLink to="/admin" className={({isActive})=>isActive?'text-nbaAccent':'text-zinc-300 hover:text-white'}>Admin</NavLink>
      </div>
    </nav>
  </header>
)

const Footer = () => (
  <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-400">
    <div className="max-w-6xl mx-auto px-4">
      <p>Ballin’ with Ocie: 13th Edition · Sept 27, 2025 · 2:00 PM · P.B. Edwards Jr. Gymnasium, Port Wentworth, GA</p>
    </div>
  </footer>
)

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/messages" element={<BirthdayWall />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<div className="p-8">Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
