export default function Home() {
  return (
    <div style={{textAlign:'center',padding:'2rem',color:'#fff',background:'#000',minHeight:'80vh'}}>
      <h2 style={{fontSize:'2.5rem',color:'#8A2BE2'}}>Welcome to Ballin' with Ocie!</h2>
      <p>Join us for the ultimate basketball tournament experience. Register to play, grab tickets, or leave Ocie a birthday message!</p>
      <div style={{marginTop:'2rem'}}>
        <a href='/register'><button>Register to Play</button></a>
        <a href='/tickets' style={{marginLeft:'1rem'}}><button>Get Tickets</button></a>
        <a href='/messages' style={{marginLeft:'1rem'}}><button>Leave a Message</button></a>
      </div>
    </div>
  );
}
