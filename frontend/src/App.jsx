import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Tickets from "./pages/Tickets.jsx";
import Messages from "./pages/Messages.jsx";
import Admin from "./pages/Admin.jsx";

const Nav = () => (
  <nav style={{background:"#111", padding:"12px 16px", display:"flex", justifyContent:"center", gap:"18px", position:"sticky", top:0}}>
    {["/","/register","/tickets","/messages","/admin"].map((to, i) => {
      const labels = ["Home","Register","Tickets","Messages","Admin"];
      return <Link key={to} to={to} style={{color:"#8A2BE2", textDecoration:"none", fontWeight:700}}>{labels[i]}</Link>
    })}
  </nav>
);

export default function App(){
  return (
    <Router>
      <div style={{minHeight:"100vh", background:"#000", color:"#fff"}}>
        <header style={{background:"#1a103d", padding:"16px 20px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.5)"}}>
          <h1 style={{margin:0, color:"#bb86fc", fontSize:"28px", fontWeight:900}}>Ballin' with Ocie: 13th Edition</h1>
          <p style={{margin:"6px 0 0", color:"#c7c7c7", fontSize:"14px"}}>Sept 27, 2025 • 2:00 PM • P.B. Edwards Jr. Gymnasium, 101 Turnberry St, Port Wentworth, GA</p>
        </header>
        <Nav/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/tickets" element={<Tickets/>} />
          <Route path="/messages" element={<Messages/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
        <footer style={{textAlign:"center", padding:"20px", color:"#a3a3a3"}}>© 2025 Ballin' with Ocie</footer>
      </div>
    </Router>
  );
}
