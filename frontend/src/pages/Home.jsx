export default function Home() {
  return (
    <div style={{minHeight:"calc(100vh - 100px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#000",color:"#fff"}}>
      <h1 style={{fontSize:"48px",color:"#8A2BE2",textShadow:"0 6px 18px rgba(138,43,226,0.35)"}}>Welcome to Ballin' with Ocie 13th Edition!</h1>
      <p>Register for contests, buy tickets, and track live results.</p>
      <div style={{marginTop:"1rem"}}>
        <a href="/register" style={{margin:"0 1rem",color:"#8A2BE2"}}>Register to Play</a>
        <a href="/tickets" style={{margin:"0 1rem",color:"#8A2BE2"}}>Get Tickets</a>
        <a href="/leaderboard" style={{margin:"0 1rem",color:"#8A2BE2"}}>View Leaderboard</a>
      </div>
    </div>
  );
}