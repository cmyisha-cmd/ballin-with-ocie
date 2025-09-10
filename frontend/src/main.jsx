import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Tickets from './pages/Tickets'
import Leaderboard from './pages/Leaderboard'
import Bracket from './pages/Bracket'
import Messages from './pages/Messages'
import Admin from './pages/Admin'
import './styles.css'

function NavBar(){
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/tickets">Tickets</Link>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/bracket">Bracket</Link>
      <Link to="/messages">Messages</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/tickets' element={<Tickets/>} />
        <Route path='/leaderboard' element={<Leaderboard/>} />
        <Route path='/bracket' element={<Bracket/>} />
        <Route path='/messages' element={<Messages/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
