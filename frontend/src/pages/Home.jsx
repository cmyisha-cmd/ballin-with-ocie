export default function Home() {
  return (
    <section className="min-h-[calc(100vh-160px)] relative bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary drop-shadow mb-4">
            Ballin’ with Ocie: 13th Edition
          </h1>
          <p className="text-neutral-300 text-lg leading-relaxed">
            A one-day NBA-style showdown featuring a Shooting Contest and a Team Tournament.
            Register to compete, grab spectator tickets, and leave a birthday message for Ocie!
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/register" className="btn">Register to Play</a>
            <a href="/tickets" className="btn">Get Tickets</a>
            <a href="/leaderboard" className="btn">View Leaderboard</a>
          </div>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2 text-primary">Event Details</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li><strong>Date:</strong> Sept 27, 2025</li>
            <li><strong>Time:</strong> 2:00 PM</li>
            <li><strong>Location:</strong> P.B. Edwards Jr. Gymnasium</li>
            <li><strong>Address:</strong> 101 Turnberry Street, Port Wentworth, GA 31407</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
