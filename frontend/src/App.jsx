import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Tickets from './pages/Tickets.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Messages from './pages/Messages.jsx';
import Admin from './pages/Admin.jsx';

export default function App(){
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar/>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/tickets" element={<Tickets/>}/>
          <Route path="/leaderboard" element={<Leaderboard/>}/>
          <Route path="/messages" element={<Messages/>}/>
          <Route path="/admin" element={<Admin/>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}