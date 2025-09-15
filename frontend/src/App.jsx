import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Tickets from "./pages/Tickets";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <header style={{background:"#111", padding:"1rem", textAlign:"center"}}>
        <h1 style={{color:"#8A2BE2", margin:0}}>Ballin' with Ocie: 13th Edition</h1>
        <nav style={{marginTop:"0.5rem"}}>
          <Link to="/" style={{margin:"0 10px"}}>Home</Link>
          <Link to="/register" style={{margin:"0 10px"}}>Register</Link>
          <Link to="/tickets" style={{margin:"0 10px"}}>Tickets</Link>
          <Link to="/messages" style={{margin:"0 10px"}}>Messages</Link>
          <Link to="/admin" style={{margin:"0 10px"}}>Admin</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}