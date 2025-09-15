export default function Tickets() {
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
        Get Tickets
      </h2>
      <p style={{maxWidth:"600px", marginTop:"10px", fontSize:"18px", color:"#E5E5E5"}}>
        Reserve tickets for non-players. (Sample list shown)
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
        <p><strong style={{color:"#8A2BE2"}}>Spectator:</strong> John Smith</p>
        <p>Requested Tickets: 3</p>
      </div>
    </div>
  );
}
