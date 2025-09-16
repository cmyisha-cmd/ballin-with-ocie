import React from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Tickets from './pages/Tickets'
import Leaderboard from './pages/Leaderboard'
import BirthdayWall from './pages/BirthdayWall'
import Admin from './pages/Admin'

const Header = () => {
  const navigate = useNavigate()
  return (
    <header className="border-b border-purple-700/40 bg-black">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-600/80" />
          <div>
            <h1 className="text-xl font-extrabold text-purple-400 tracking-wide">Ballin' with Ocie</h1>
            <p className="text-xs text-neutral-400">13th Edition • Sept 27, 2025 • 2:00 PM • P.B. Edwards Jr. Gymnasium</p>
          </div>
        </div>
        <nav className="flex gap-4 text-sm">
          <NavLink className={({isActive}) => `px-3 py-1 rounded ${isActive?'bg-purple-700/30 text-white':'text-neutral-300 hover:text-white'}`} to="/">Home</NavLink>
          <NavLink className={({isActive}) => `px-3 py-1 rounded ${isActive?'bg-purple-700/30 text-white':'text-neutral-300 hover:text-white'}`} to="/register">Register</NavLink>
          <NavLink className={({isActive}) => `px-3 py-1 rounded ${isActive?'bg-purple-700/30 text-white':'text-neutral-300 hover:text-white'}`} to="/tickets">Get Tickets</NavLink>
          <NavLink className={({isActive}) => `px-3 py-1 rounded ${isActive?'bg-purple-700/30 text-white':'text-neutral-300 hover:text-white'}`} to="/leaderboard">Leaderboard</NavLink>
          <NavLink className={({isActive}) => `px-3 py-1 rounded ${isActive?'bg-purple-700/30 text-white':'text-neutral-300 hover:text-white'}`} to="/birthday">Birthday Wall</NavLink>
          <button onClick={()=>navigate('/admin')} className="px-3 py-1 rounded text-neutral-300 hover:text-white">Admin</button>
        </nav>
      </div>
    </header>
  )
}

const Footer = () => (
  <footer className="border-t border-purple-700/40 bg-black">
    <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-neutral-400">
      © 2025 Ballin' with Ocie • P.B. Edwards Jr. Gymnasium • 101 Turnberry St, Port Wentworth, GA 31407
    </div>
  </footer>
)

export default function App(){
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/birthday" element={<BirthdayWall />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
