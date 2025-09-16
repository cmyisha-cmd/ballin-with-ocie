export default function Home(){
  return (
    <section className="container-nba py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-black text-nbaPurple drop-shadow-lg">Welcome to Ballin’ with Ocie!</h1>
      <p className="mt-4 text-zinc-300 max-w-2xl mx-auto">
        Register for the Shooting Contest or Team Tournament, secure spectator tickets, and leave a birthday message.
        Track live scores and brackets during the event.
      </p>
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <a href="/register" className="card hover:ring-2 hover:ring-nbaPurple transition">
          <h3 className="text-xl font-bold text-nbaPurple">Register to Play</h3>
          <p className="text-sm text-zinc-300 mt-2">Players can sign up for Shooting, Teams, or both.</p>
        </a>
        <a href="/tickets" className="card hover:ring-2 hover:ring-nbaPurple transition">
          <h3 className="text-xl font-bold text-nbaPurple">Get Tickets</h3>
          <p className="text-sm text-zinc-300 mt-2">Reserve your non-player tickets for pickup at the box office.</p>
        </a>
        <a href="/leaderboard" className="card hover:ring-2 hover:ring-nbaPurple transition">
          <h3 className="text-xl font-bold text-nbaPurple">View Leaderboard</h3>
          <p className="text-sm text-zinc-300 mt-2">Live shooting standings auto-refresh.</p>
        </a>
      </div>
    </section>
  )
}
