import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section className="hero">

      {/* ✅ Graffiti Logo from public/ folder */}
      <div style={{textAlign:'center', marginBottom:'20px'}}>
        <h1>
          <img 
            src="/ocie-logo.png" 
            alt="Ballin' With Ocie: 13th Edition" 
            style={{
              maxWidth: '420px',
              width: '100%',
              height: 'auto',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </h1>
      </div>

      <p 
        className="muted" 
        style={{
          textAlign:'center', 
          maxWidth:'600px', 
          margin:'0 auto'
        }}
      >
        Come out and help us celebrate Ocie!!!  
        Register to play or get tickets to come to watch and cheer.  
        Don't forget to drop the Birthday Boy a message.

      </p>

      <div 
        className="cta" 
        style={{
          display:'flex', 
          justifyContent:'center', 
          flexWrap:'wrap', 
          gap:'12px', 
          marginTop:'20px'
        }}
      >
        <Link className="btn" to="/register">Register to Play</Link>
        <Link className="btn" to="/tickets">Get Tickets</Link>
        <Link className="btn" to="/birthday">Leave a Birthday Wish</Link>
        <Link className="btn" to="/leaderboard">View Leaderboard</Link>
      </div>
    </section>
  )
}
