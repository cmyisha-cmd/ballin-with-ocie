import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Tickets from "./pages/Tickets";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <>
      <nav style={{ background: "#111", padding: "1rem", display:"flex", justifyContent:"center", gap:"1rem" }}>
        <Link style={{ color:"#8A2BE2", textDecoration:"none", fontWeight:"bold" }} to="/">Home</Link>
        <Link style={{ color:"#fff", textDecoration:"none" }} to="/register">Register</Link>
        <Link style={{ color:"#fff", textDecoration:"none" }} to="/tickets">Tickets</Link>
        <Link style={{ color:"#fff", textDecoration:"none" }} to="/messages">Messages</Link>
        <Link style={{ color:"#fff", textDecoration:"none" }} to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}
