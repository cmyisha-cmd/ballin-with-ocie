import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Tickets from './pages/Tickets.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import BirthdayWall from './pages/BirthdayWall.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

export default function App(){
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/tickets" element={<Tickets/>}/>
        <Route path="/leaderboard" element={<Leaderboard/>}/>
        <Route path="/birthday-wall" element={<BirthdayWall/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}
