
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import BirthdayWall from './pages/BirthdayWall.jsx';
import Register from './pages/Register.jsx';
import Tickets from './pages/Tickets.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/birthday-wall" element={<BirthdayWall />} />
      </Routes>
    </Router>
  );
}
