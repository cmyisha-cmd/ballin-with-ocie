import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ minHeight:"calc(100vh - 180px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"2rem", background:"#000", color:"#fff" }}>
      <h2 style={{fontSize:"48px", lineHeight:"1.1", margin:"0 0 14px", fontWeight:900, color:"#8A2BE2", textShadow:"0 6px 18px rgba(138,43,226,.35)"}}>
        Welcome to Ballin’ with Ocie!
      </h2>
      <p style={{fontSize:"20px", color:"#E5E5E5", maxWidth:760, marginBottom:"2rem"}}>
        Register for the Shooting Contest and Team Tournament, secure tickets, and leave a birthday message.
        Track live scores and brackets during the event.
      </p>
      <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", justifyContent:"center" }}>
        <Link to="/register" style={{ background:"#8A2BE2", color:"#fff", padding:"0.8rem 1.5rem", borderRadius:"10px", textDecoration:"none" }}>Register to Play</Link>
        <Link to="/tickets" style={{ background:"#8A2BE2", color:"#fff", padding:"0.8rem 1.5rem", borderRadius:"10px", textDecoration:"none" }}>Get Tickets</Link>
        <Link to="/leaderboard" style={{ background:"#8A2BE2", color:"#fff", padding:"0.8rem 1.5rem", borderRadius:"10px", textDecoration:"none" }}>View Leaderboard</Link>
        <Link to="/birthday-wall" style={{ background:"#8A2BE2", color:"#fff", padding:"0.8rem 1.5rem", borderRadius:"10px", textDecoration:"none" }}>Leave a Birthday Wish</Link>
      </div>
    </div>
  );
}