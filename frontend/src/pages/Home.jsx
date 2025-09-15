import { Link } from 'react-router-dom';
export default function Home(){
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-black to-ink"></div>
      <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-3 drop-shadow">Ballin’ with Ocie: <span className="text-primary">13th Edition</span></h1>
        <p className="text-purple-200">P.B. Edwards Jr. Gymnasium • 101 Turnberry St, Port Wentworth, GA • Sept 27, 2025 • 2:00 PM</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/register" className="rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 shadow-glow p-6 font-semibold">Register to Play</Link>
          <Link to="/tickets" className="rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 shadow-glow p-6 font-semibold">Get Tickets</Link>
          <Link to="/leaderboard" className="rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 shadow-glow p-6 font-semibold">View Leaderboard</Link>
        </div>
      </div>
    </section>
  );
}