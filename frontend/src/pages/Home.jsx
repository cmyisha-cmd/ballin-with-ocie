import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h1 className="title">Ballin’ with Ocie: 13th Edition</h1>
          <p className="subtitle">
            Sept 27, 2025 · 2:00 PM · P.B. Edwards Jr. Gymnasium<br/>
            101 Turnberry Street, Port Wentworth, GA 31407
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link className="btn" to="/register">Register to Play</Link>
            <Link className="btn" to="/tickets">Get Tickets</Link>
            <Link className="btn" to="/messages">Leave a Birthday Wish</Link>
            <Link className="btn" to="/leaderboard">View Leaderboard</Link>
          </div>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-3">Event Options</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Shooting Contest — fastest high score wins (tie-breaker: least time)</li>
            <li>Team Tournament — auto-assigned teams & NBA-style bracket</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
