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

function NavBar(){
  const navStyle={display:'flex',gap:'12px',padding:'12px',background:'#111',justifyContent:'center'}
  const linkStyle={color:'#fff',textDecoration:'none',fontWeight:'bold'}
  return(<nav style={navStyle}>
    <Link style={linkStyle} to="/">Home</Link>
    <Link style={linkStyle} to="/register">Register</Link>
    <Link style={linkStyle} to="/tickets">Tickets</Link>
    <Link style={linkStyle} to="/leaderboard">Leaderboard</Link>
    <Link style={linkStyle} to="/bracket">Bracket</Link>
    <Link style={linkStyle} to="/messages">Messages</Link>
    <Link style={linkStyle} to="/admin">Admin</Link>
  </nav>)
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/tickets' element={<Tickets/>}/>
        <Route path='/leaderboard' element={<Leaderboard/>}/>
        <Route path='/bracket' element={<Bracket/>}/>
        <Route path='/messages' element={<Messages/>}/>
        <Route path='/admin' element={<Admin/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
