export default function Home() {
  return (
    <div style={{
      minHeight:"calc(100vh - 180px)",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      textAlign:"center",
      padding:"2rem",
      background:"#000",
      color:"#fff"
    }}>
      <h2 style={{fontSize:"48px", fontWeight:900, color:"#8A2BE2"}}>
        Welcome to Ballin’ with Ocie!
      </h2>
      <p style={{fontSize:"20px", color:"#E5E5E5"}}>
        Register for events, get tickets, and leave a birthday message!
      </p>
    </div>
  );
}
