import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Register from './pages/Register'
import Tickets from './pages/Tickets'
import Messages from './pages/Messages'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Home />} />
          <Route path='register' element={<Register />} />
          <Route path='tickets' element={<Tickets />} />
          <Route path='messages' element={<Messages />} />
          <Route path='leaderboard' element={<Leaderboard />} />
          <Route path='admin' element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
