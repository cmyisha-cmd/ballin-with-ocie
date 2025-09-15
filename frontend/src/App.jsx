import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Tickets from './pages/Tickets.jsx';
import Leaderboard from './pages/Leaderboard.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 bg-purple-900 shadow-lg flex justify-between">
        <h1 className="text-2xl font-bold">Ballin' with Ocie</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-purple-300">Home</Link>
          <Link to="/register" className="hover:text-purple-300">Register</Link>
          <Link to="/tickets" className="hover:text-purple-300">Tickets</Link>
          <Link to="/leaderboard" className="hover:text-purple-300">Leaderboard</Link>
        </nav>
      </header>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </div>
  );
}