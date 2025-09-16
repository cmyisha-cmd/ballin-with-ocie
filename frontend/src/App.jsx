import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Tickets from './pages/Tickets.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import BirthdayWall from './pages/BirthdayWall.jsx'
import Admin from './pages/Admin.jsx'

function NavItem({to, children}){
  return <NavLink to={to} className={({isActive}) => `px-3 py-2 rounded ${isActive?'bg-purple-700 text-white':'text-purple-300 hover:bg-purple-800/60'}`}>{children}</NavLink>
}

export default function App(){
  return (
    <div className="min-h-screen nba-gradient">
      <header className="border-b border-zinc-800/80 bg-black/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-600 grid place-items-center font-black">B</div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Ballin' with Ocie</h1>
              <p className="text-xs text-zinc-400">13th Edition • P.B. Edwards Jr. Gym • Sept 27, 2025 @ 2:00 PM</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/register">Register</NavItem>
            <NavItem to="/tickets">Get Tickets</NavItem>
            <NavItem to="/leaderboard">Leaderboard</NavItem>
            <NavItem to="/birthday-wall">Birthday Wall</NavItem>
            <NavItem to="/admin">Admin</NavItem>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/tickets" element={<Tickets/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/birthday-wall" element={<BirthdayWall/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>
      <footer className="border-t border-zinc-800/80 text-zinc-400 text-sm py-6 text-center">
        © 2025 Ballin' with Ocie • Port Wentworth, GA
      </footer>
    </div>
  )
}
