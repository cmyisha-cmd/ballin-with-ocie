import { Link, useLocation } from 'react-router-dom'

export default function Navbar(){
  const { pathname } = useLocation();
  const link = (to, label)=>(
    <Link className="link" style={{borderColor: pathname===to ? '#2b2b2b' : 'transparent'}} to={to}>{label}</Link>
  );
  return (
    <nav>
      <div className="container inner">
        <div className="brand">
          <div className="logo">🏀</div>
          <div className="title">
            <b>Ballin' with Ocie</b>
            <span>13th Edition</span>
          </div>
        </div>
        <div className="flex" style={{gap:'.4rem', flexWrap:'wrap'}}>
          {link('/','Home')}
          {link('/register','Register')}
          {link('/tickets','Get Tickets')}
          {link('/leaderboard','Leaderboard')}
          {link('/birthday-wall','Birthday Wall')}
          {link('/admin','Admin')}
        </div>
      </div>
    </nav>
  )
}
