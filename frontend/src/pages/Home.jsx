import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/ocie-logo.png'   // ✅ correct relative path

export default function Home(){
  return (
    <section className="hero">

      {/* ✅ Graffiti Logo as the only H1 */}
      <div style={{textAlign:'center', marginBottom:'20px'}}>
        <h1>
          <img 
            src={logo} 
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
        Register for the Shooting Contest and Team Tournament, secure tickets, and leave a birthday message. 
        Track live scores and brackets during the event.
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
