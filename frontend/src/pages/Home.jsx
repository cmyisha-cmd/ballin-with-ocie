
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{
      background:"#000", color:"#fff", textAlign:"center",
      minHeight:"100vh", display:"flex", flexDirection:"column",
      justifyContent:"center", alignItems:"center"
    }}>
      <h1 style={{color:"#8A2BE2", fontSize:"48px"}}>Welcome to Ballin’ with Ocie!</h1>
      <p style={{color:"#E5E5E5"}}>Register for contests, get tickets, and leave a birthday message.</p>
      <Link to="/register"><button>Register to Play</button></Link>
      <Link to="/tickets"><button>Get Tickets</button></Link>
      <Link to="/birthday-wall"><button>Leave a Birthday Wish</button></Link>
    </div>
  );
}
