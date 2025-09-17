import React from "react";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div style={{minHeight:"100vh", background:"#000", color:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
      <h1 style={{color:"#8A2BE2", fontSize:"48px"}}>Welcome to Ballin' with Ocie!</h1>
      <div style={{marginTop:"20px", display:"flex", flexDirection:"column", gap:"10px"}}>
        <Link to="/register"><button>Register to Play</button></Link>
        <Link to="/tickets"><button>Get Tickets</button></Link>
        <Link to="/wall"><button>Leave a Birthday Message</button></Link>
        <Link to="/admin"><button>Admin Dashboard</button></Link>
      </div>
    </div>
  );
}