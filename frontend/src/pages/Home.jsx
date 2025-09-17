
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="h1">Welcome to Ballin’ with Ocie!</h1>
      <p className="mt-4 text-white/80 max-w-2xl mx-auto">
        Register for the Shooting Contest and Team Tournament, secure tickets, and leave a birthday message.
        Track scores and brackets during the event.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link to="/register" className="btn">Register to Play</Link>
        <Link to="/tickets" className="btn">Get Tickets</Link>
        <Link to="/birthday-wall" className="btn">Leave a Birthday Wish</Link>
      </div>
    </div>
  )
}
