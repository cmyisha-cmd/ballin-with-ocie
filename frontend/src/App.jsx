import { Link, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Tickets from './pages/Tickets.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import BirthdayWall from './pages/BirthdayWall.jsx'
import Admin from './pages/Admin.jsx'

const NavItem = ({to, children}) => (
  <NavLink to={to} className={({isActive}) => `px-3 py-2 rounded-lg ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'}`}>
    {children}
  </NavLink>
)

export default function App(){
  return (
    <div>
      <nav className="nav">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="font-display text-xl text-primary">Ballin’ with Ocie</Link>
          <div className="ml-auto flex gap-2">
            <NavItem to="/register">Register</NavItem>
            <NavItem to="/tickets">Tickets</NavItem>
            <NavItem to="/leaderboard">Leaderboard</NavItem>
            <NavItem to="/birthday-wall">Birthday Wall</NavItem>
            <NavItem to="/admin">Admin</NavItem>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/tickets" element={<Tickets/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/birthday-wall" element={<BirthdayWall/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>

      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-400">
          <div><span className="font-display text-primary">Ballin’ with Ocie: 13th Edition</span></div>
          <div className="mt-2">P.B. Edwards Jr. Gymnasium — 101 Turnberry Street, Port Wentworth, GA 31407</div>
          <div>September 27, 2025 — 2:00 PM</div>
        </div>
      </footer>
    </div>
  )
}
