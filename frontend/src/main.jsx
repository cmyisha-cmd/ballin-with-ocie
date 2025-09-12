import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Tickets from "./pages/Tickets";
import Leaderboard from "./pages/Leaderboard";
import Bracket from "./pages/Bracket";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";

const API_BASE = import.meta.env?.VITE_API_BASE?.replace(/\/+$/, "") || "MISSING";

function App() {
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    if (API_BASE === "MISSING") {
      setApiStatus("missing");
      return;
    }
    fetch(API_BASE + "/api/players")
      .then((res) => res.json())
      .then(() => setApiStatus("ok"))
      .catch(() => setApiStatus("offline"));
  }, []);

  if (apiStatus === "checking") {
    return <div style={styles.loading}>🔄 Checking API...</div>;
  }
  if (apiStatus === "missing") {
    return <div style={styles.error}>❌ <strong>VITE_API_BASE</strong> is not set!</div>;
  }
  if (apiStatus === "offline") {
    return <div style={styles.error}>❌ Could not reach API at <code>{API_BASE}</code></div>;
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/bracket" element={<Bracket />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

function NavBar() {
  const navStyle = {display:"flex",gap:"8px",padding:"12px",background:"#111",justifyContent:"center",flexWrap:"wrap"};
  const linkStyle = {color:"#fff",textDecoration:"none",fontWeight:"bold",padding:"6px 10px"};
  return (<nav style={navStyle}>
    <Link style={linkStyle} to="/">Home</Link>
    <Link style={linkStyle} to="/register">Register</Link>
    <Link style={linkStyle} to="/tickets">Tickets</Link>
    <Link style={linkStyle} to="/leaderboard">Leaderboard</Link>
    <Link style={linkStyle} to="/bracket">Bracket</Link>
    <Link style={linkStyle} to="/messages">Messages</Link>
    <Link style={linkStyle} to="/admin">Admin</Link>
  </nav>);
}

const styles = {
  loading:{textAlign:"center",marginTop:"50px",fontSize:"1.5rem"},
  error:{margin:"40px auto",maxWidth:"500px",padding:"20px",background:"#330000",color:"#fff",border:"2px solid #ff4d4d",borderRadius:"10px",textAlign:"center",fontSize:"1.2rem"}
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
