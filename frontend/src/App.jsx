import { Outlet, Link, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet key={pathname} />
      </main>
      <Footer />
    </div>
  )
}
