import { Link, useLocation } from 'react-router-dom';
export default function Navbar(){
  const { pathname } = useLocation();
  const link = (to, label) => (
    <Link to={to} className={`px-3 py-2 rounded-md text-sm font-semibold transition ${pathname===to?'bg-primary text-white':'text-purple-300 hover:text-white hover:bg-primary/20'}`}>{label}</Link>
  );
  return (
    <header className="bg-ink/90 border-b border-primary/30 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-xl font-extrabold tracking-wide">Ballin’ with Ocie</div>
        <nav className="flex gap-2">
          {link('/','Home')}
          {link('/register','Register')}
          {link('/tickets','Tickets')}
          {link('/leaderboard','Leaderboard')}
          {link('/messages','Birthday Wall')}
          {link('/admin','Admin')}
        </nav>
      </div>
    </header>
  );
}