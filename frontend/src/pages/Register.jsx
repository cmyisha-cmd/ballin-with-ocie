export default function Register() {
  return (
    <div style={{minHeight:"calc(100vh - 180px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"2rem", background:"#000", color:"#fff"}}>
      <h2 style={{fontSize:"40px", fontWeight:900, color:"#8A2BE2", textShadow:"0 4px 12px rgba(138,43,226,.35)"}}>Player Registration</h2>
      <iframe 
        src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"
        width="100%" height="700"
        style={{border:"none", marginTop:"20px"}}
        title="Player Registration Form"
      >
        Loading…
      </iframe>
    </div>
  );
}