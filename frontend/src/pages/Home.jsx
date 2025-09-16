import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="hero container">
      <div className="badge">Ballin' with Ocie: <b>13th Edition</b> • Sep 27, 2025 • 2:00 PM</div>
      <h1>Welcome to Ballin’ with Ocie!</h1>
      <p className="kicker">Register to play, get tickets, post birthday wishes, and track live scores.</p>
      <div className="actions">
        <Link className="btn" to="/register">Register to Play</Link>
        <Link className="btn" to="/tickets">Get Tickets</Link>
        <Link className="btn" to="/leaderboard">View Leaderboard</Link>
        <Link className="btn" to="/birthday-wall">Leave a Birthday Wish</Link>
      </div>
    </div>
  )
}
