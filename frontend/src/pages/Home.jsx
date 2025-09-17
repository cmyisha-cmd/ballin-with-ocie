export default function Home(){
  return (
    <section className="grid lg:grid-cols-2 gap-8 items-center">
      <div className="card">
        <h1 className="text-primary mb-3">Welcome to Ballin’ with Ocie!</h1>
        <p className="text-white/80">
          Register for the Shooting Contest and Team Tournament, secure tickets, and leave a birthday
          message. Track live scores and brackets during the event.
        </p>
        <ul className="mt-6 space-y-2 text-white/70">
          <li>• Shooting Contest leaderboard updates in real time</li>
          <li>• Auto-assigned NBA-style team bracket</li>
          <li>• Tickets available for spectators</li>
        </ul>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <a href="/register" className="btn">Register to Play</a>
        <a href="/tickets" className="btn">Get Tickets</a>
        <a href="/leaderboard" className="btn">View Leaderboard</a>
        <a href="/birthday" className="btn">Leave a Birthday Wish</a>
      </div>
    </section>
  )
}
