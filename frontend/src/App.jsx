import { Link, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Tickets from './pages/Tickets.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import BirthdayWall from './pages/BirthdayWall.jsx'
import Admin from './pages/Admin.jsx'

const navLink = ({isActive}) => `px-3 py-2 rounded-xl ${isActive? 'bg-primary/30 text-white' : 'text-white/80 hover:text-white'}`

export default function App(){
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-black/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-black text-xl text-white">
            Ballin’ with Ocie: <span className="text-primary">13th Edition</span>
          </Link>
          <nav className="flex gap-2">
            <NavLink to="/" className={navLink} end>Home</NavLink>
            <NavLink to="/register" className={navLink}>Register</NavLink>
            <NavLink to="/tickets" className={navLink}>Get Tickets</NavLink>
            <NavLink to="/leaderboard" className={navLink}>Leaderboard</NavLink>
            <NavLink to="/birthday" className={navLink}>Birthday Wall</NavLink>
            <NavLink to="/admin" className={navLink}>Admin</NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/tickets" element={<Tickets/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/birthday" element={<BirthdayWall/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>

      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-white/60">
          P.B. Edwards Jr. Gymnasium • 101 Turnberry Street • Port Wentworth, GA 31407 •
          Sept 27, 2025 @ 2:00 PM
        </div>
      </footer>
    </div>
  )
}
