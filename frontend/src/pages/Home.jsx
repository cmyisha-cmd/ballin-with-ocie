import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/ocie-logo.png'   // ✅ save your uploaded image in frontend/src/assets as ocie-logo.png

export default function Home(){
  const [count, setCount] = useState(0)

  return (
    <section className="hero">
      {/* ✅ Centered Logo as H1 */}
      <div style={{textAlign:'center', marginBottom:'20px'}}>
        <h1>
          <img 
            src={logo} 
            alt="Ballin' With Ocie: 13th Edition" 
            style={{maxWidth:'400px', width:'100%', height:'auto'}}
          />
        </h1>
      </div>

      <p className="muted" style={{textAlign:'center'}}>
        Come out & help us celebrate Ocie!!!  Register to play or get tickets to come to watch and cheer.  Don't forget to drop the Birthday Boy a message.
      </p>

      <div className="cta" style={{display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'12px', marginTop:'20px'}}>
        <Link className="btn" to="/register">Register to Play</Link>
        <Link className="btn" to="/tickets">Get Tickets</Link>
        <Link className="btn" to="/birthday">Leave a Birthday Wish</Link>
        <Link className="btn" to="/leaderboard">View Leaderboard</Link>
      </div>
    </section>
  )
}
