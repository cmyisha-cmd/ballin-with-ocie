import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Tickets from './pages/Tickets'
import BirthdayWall from './pages/BirthdayWall'
import Admin from './pages/Admin'
import Leaderboard from './pages/Leaderboard'
import Bracket from './pages/Bracket'

export default function App(){
  return (
    <>
      <header className="site-header">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
          <Link to="/tickets">Tickets</Link>
          <Link to="/birthdaywall">Birthday Wall</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/bracket">Bracket</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/tickets" element={<Tickets/>} />
        <Route path="/birthdaywall" element={<BirthdayWall/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/bracket" element={<Bracket/>} />
      </Routes>
    </>
  )
}
