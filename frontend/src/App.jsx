import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Tickets from "./pages/Tickets";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <div style={{background:"#111", padding:"1rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h1 style={{color:"#8A2BE2", fontSize:"24px", fontWeight:"bold"}}>Ballin’ with Ocie</h1>
        <nav style={{display:"flex", gap:"1.5rem"}}>
          <Link style={{color:"#fff"}} to="/">Home</Link>
          <Link style={{color:"#fff"}} to="/register">Register</Link>
          <Link style={{color:"#fff"}} to="/tickets">Tickets</Link>
          <Link style={{color:"#fff"}} to="/messages">Messages</Link>
          <Link style={{color:"#fff"}} to="/admin">Admin</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <footer style={{background:"#111", color:"#aaa", textAlign:"center", padding:"1rem"}}>
        © 2025 Ballin’ with Ocie: 13th Edition
      </footer>
    </Router>
  );
}