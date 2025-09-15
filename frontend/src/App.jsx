import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Tickets from './pages/Tickets.jsx';
import Messages from './pages/Messages.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <header style={{background:'#1a103d', color:'white', padding:'1rem'}}>
        <h1>Ballin' with Ocie: 13th Edition</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/register">Register</Link> | <Link to="/tickets">Tickets</Link> | <Link to="/messages">Messages</Link> | <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<div style={{padding:'2rem'}}>Welcome to Ballin' with Ocie!</div>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/tickets" element={<Tickets/>} />
        <Route path="/messages" element={<Messages/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  );
}
