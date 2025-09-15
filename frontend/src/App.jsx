import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Tickets from './pages/Tickets.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Admin from './pages/Admin.jsx';

export default function App(){
  return (
    <BrowserRouter>
      <header className="bg-nbaDark border-b border-purple-900/40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Ballin’ with Ocie</h1>
          <nav className="flex gap-4 text-sm">
            <Link className="text-purple-300 hover:text-white" to="/">Home</Link>
            <Link className="text-purple-300 hover:text-white" to="/register">Register</Link>
            <Link className="text-purple-300 hover:text-white" to="/tickets">Tickets</Link>
            <Link className="text-purple-300 hover:text-white" to="/leaderboard">Leaderboard</Link>
            <Link className="text-purple-300 hover:text-white" to="/admin">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-120px)] bg-black">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/tickets" element={<Tickets/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>
      <footer className="bg-nbaDark border-t border-purple-900/40 text-center text-xs text-purple-200 py-4">
        Ballin’ with Ocie: 13th Edition — Sept 27, 2025 · 2:00 PM · P.B. Edwards Jr. Gymnasium
      </footer>
    </BrowserRouter>
  );
}
