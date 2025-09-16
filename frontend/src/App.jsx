import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Tickets from "./pages/Tickets.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import BirthdayWall from "./pages/BirthdayWall.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <Router>
      <nav style={{display:"flex",gap:"1rem",background:"#000",padding:"1rem"}}>
        <Link to="/" style={{color:"#fff"}}>Home</Link>
        <Link to="/register" style={{color:"#fff"}}>Register</Link>
        <Link to="/tickets" style={{color:"#fff"}}>Tickets</Link>
        <Link to="/leaderboard" style={{color:"#fff"}}>Leaderboard</Link>
        <Link to="/birthday-wall" style={{color:"#fff"}}>Birthday Wall</Link>
        <Link to="/admin" style={{color:"#fff"}}>Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/birthday-wall" element={<BirthdayWall />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}