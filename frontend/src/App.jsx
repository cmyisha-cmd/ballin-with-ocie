import React from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Tickets from './pages/Tickets.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import BirthdayWall from './pages/BirthdayWall.jsx'
import Admin from './pages/Admin.jsx'

const LinkItem = ({to, children}) => (
  <NavLink to={to} className={({isActive}) =>
    `px-3 py-2 rounded-lg font-semibold ${isActive ? 'text-white bg-nbaPurple/40' : 'text-white hover:text-nbaPurple'}`
  }>{children}</NavLink>
)

export default function App(){
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="border-b border-zinc-800 bg-gradient-to-b from-nbaPurpleDark/40 to-black sticky top-0 z-10">
        <div className="container-nba flex items-center gap-6 py-4">
          <div className="text-2xl font-black text-nbaPurple">Ballin' with Ocie: 13th Edition</div>
          <nav className="flex gap-2 flex-wrap">
            <LinkItem to="/">Home</LinkItem>
            <LinkItem to="/register">Register</LinkItem>
            <LinkItem to="/tickets">Get Tickets</LinkItem>
            <LinkItem to="/leaderboard">Leaderboard</LinkItem>
            <LinkItem to="/birthday">Birthday Wall</LinkItem>
            <LinkItem to="/admin">Admin</LinkItem>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/tickets" element={<Tickets/>}/>
          <Route path="/leaderboard" element={<Leaderboard/>}/>
          <Route path="/birthday" element={<BirthdayWall/>}/>
          <Route path="/admin" element={<Admin/>}/>
        </Routes>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="container-nba text-sm text-zinc-400 py-6">
          P.B. Edwards Jr. Gymnasium • 101 Turnberry Street, Port Wentworth, GA 31407 • Sept 27, 2025 • 2:00 PM
        </div>
      </footer>
    </div>
  )
}
