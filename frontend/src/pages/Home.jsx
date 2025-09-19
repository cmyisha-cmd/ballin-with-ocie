import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section className="hero">
      <div>
        <h1>Welcome to Ballin’ with Ocie!</h1>
        <p className="muted">Register for the Shooting Contest and Team Tournament, secure tickets, and leave a birthday message. Track live scores and brackets during the event.</p>
        <div className="cta">
          <Link className="btn" to="/register">Register to Play</Link>
          <Link className="btn" to="/tickets">Get Tickets</Link>
          <Link className="btn" to="/birthday">Leave a Birthday Wish</Link>
          <Link className="btn" to="/leaderboard">View Leaderboard</Link>
        </div>
      </div>
    </section>
  )
}
