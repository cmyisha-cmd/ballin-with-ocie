import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="min-h-[calc(100vh-200px)] grid place-items-center px-6">
      <div className="text-center space-y-6">
        <h1 className="h1">Welcome to Ballin’ with Ocie!</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Register for the Shooting Contest and Team Tournament, secure tickets, leave a birthday message, and track live scores & brackets.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link className="btn" to="/register">Register to Play</Link>
          <Link className="btn" to="/tickets">Get Tickets</Link>
          <Link className="btn" to="/leaderboard">View Leaderboard</Link>
          <Link className="btn" to="/birthday-wall">Leave a Birthday Wish</Link>
        </div>
      </div>
    </div>
  )
}
