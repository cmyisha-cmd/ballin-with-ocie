import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-nbaDark to-black"></div>
      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow mb-4">
          Ballin’ with Ocie: <span className="text-purple-400">13th Edition</span>
        </h2>
        <p className="text-purple-200 max-w-2xl mx-auto">
          Sept 27, 2025 · 2:00 PM · P.B. Edwards Jr. Gymnasium, 101 Turnberry St, Port Wentworth, GA
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/register" className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-glow">Register to Play</Link>
          <Link to="/tickets" className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-glow">Get Tickets</Link>
          <Link to="/leaderboard" className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-glow">View Leaderboard</Link>
        </div>
      </div>
    </section>
  );
}
