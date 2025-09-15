import { Link, NavLink } from 'react-router-dom'

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({isActive}) => `px-3 py-2 rounded hover:bg-neutral-800 ${isActive ? 'text-primary' : 'text-white'}`}
  >
    {children}
  </NavLink>
)

export default function Navbar() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl text-primary">Ballin’ with Ocie</Link>
        <nav className="flex gap-2">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/register">Register</NavItem>
          <NavItem to="/tickets">Get Tickets</NavItem>
          <NavItem to="/messages">Messages</NavItem>
          <NavItem to="/leaderboard">Leaderboard</NavItem>
          <NavItem to="/admin">Admin</NavItem>
        </nav>
      </div>
    </header>
  )
}
