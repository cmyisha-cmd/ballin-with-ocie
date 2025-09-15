export default function Register() {
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
      <h2 style={{fontSize:"40px", fontWeight:900, color:"#8A2BE2", textShadow:"0 4px 12px rgba(138,43,226,.35)"}}>
        Player Registration
      </h2>
      <p style={{maxWidth:"600px", marginTop:"10px", fontSize:"18px", color:"#E5E5E5"}}>
        Register for the Shooting Contest and Team Tournament. (Sample data shown)
      </p>
      <div style={{
        marginTop:"20px",
        background:"#111",
        padding:"15px",
        borderRadius:"12px",
        width:"100%",
        maxWidth:"500px",
        textAlign:"left"
      }}>
        <p><strong style={{color:"#8A2BE2"}}>Sample Player:</strong> Ocie Johnson</p>
        <p>Events: Shooting Contest, Team Tournament</p>
      </div>
    </div>
  );
}
