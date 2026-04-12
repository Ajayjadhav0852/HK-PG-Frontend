import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import hkpgLogo from '../assets/hkpg-logo.png'

const navLinks = [
  { label: 'Home',          path: '/' },
  { label: 'Facilities',    path: '/facilities' },
  { label: 'Accommodation', path: '/accommodation' },
  { label: 'Testimonials',  path: '/testimonials' },
  { label: 'Contact Us',    path: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()

  const go = (path) => { setMenuOpen(false); navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const handleLogout = () => { logout(); go('/') }

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const btnStyle = { background: 'linear-gradient(135deg, #d63384, #c026d3)' }

  return (
    <header className="sticky top-0 z-50 shadow-sm backdrop-blur-md"
      style={{ background: 'linear-gradient(135deg, rgba(255,240,246,0.97) 0%, rgba(253,243,231,0.97) 60%, rgba(255,248,240,0.97) 100%)' }}>

      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

        {/* Brand */}
        <button onClick={() => go('/')} className="flex items-center gap-3 flex-shrink-0">
          <img src={hkpgLogo} alt="HKPG Logo"
            className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-pink-200 flex-shrink-0" />
          <div className="leading-tight hidden sm:block text-left">
            <p className="font-extrabold text-gray-800 text-sm">HK PG</p>
            <p className="text-xs font-semibold" style={{ color: '#c026d3' }}>Boys Accommodation</p>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button key={link.path} onClick={() => go(link.path)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive(link.path) ? 'text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-pink-50'}`}
              style={isActive(link.path) ? btnStyle : {}}>
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side — auth buttons */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              <button
                onClick={() => go(user.role === 'admin' ? '/admin' : '/student')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-50 transition">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
                  style={btnStyle}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:block">{user.name.split(' ')[0]}</span>
              </button>
              <button onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
                style={btnStyle}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => go('/login')}
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 border border-gray-200 hover:bg-pink-50 transition">
                Login
              </button>
              <button onClick={() => go('/register')}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
                style={btnStyle}>
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="md:hidden flex flex-col justify-center gap-1.5 p-2 ml-auto"
          onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ background: 'linear-gradient(135deg, #fff0f6, #fff8f0)' }}>
        <div className="border-t border-pink-100 px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <button key={link.path} onClick={() => go(link.path)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${isActive(link.path) ? 'text-white' : 'text-gray-700 hover:bg-pink-50'}`}
              style={isActive(link.path) ? btnStyle : {}}>
              {link.label}
            </button>
          ))}

          <div className="border-t border-pink-100 mt-2 pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <button onClick={() => go(user.role === 'admin' ? '/admin' : '/student')}
                  className="text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-50 transition">
                  👤 {user.name} ({user.role})
                </button>
                <button onClick={handleLogout}
                  className="flex items-center justify-center px-4 py-3 rounded-xl font-bold text-white text-sm"
                  style={btnStyle}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => go('/login')}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 border border-gray-200 hover:bg-pink-50 transition text-center">
                  Login
                </button>
                <button onClick={() => go('/register')}
                  className="flex items-center justify-center px-4 py-3 rounded-xl font-bold text-white text-sm"
                  style={btnStyle}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
