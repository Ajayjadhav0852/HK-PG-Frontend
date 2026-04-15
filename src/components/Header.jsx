import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import hkpgLogo from '../assets/hkpg-logo.png'

const navLinks = [
  { label: 'Home', path: '/', id: 'home' },
  { label: 'Facilities', path: '/facilities', id: 'facilities' },
  { label: 'Accommodation', path: '/accommodation', id: 'accommodation' },
  { label: 'Testimonials', path: '/testimonials', id: 'testimonials' },
  { label: 'Contact Us', path: '/contact', id: 'contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const btnStyle = { background: 'linear-gradient(135deg, #d63384, #c026d3)' }

  // ✅ Active section
  useEffect(() => {
    const handleScroll = () => {
      let current = 'home'
      navLinks.forEach(link => {
        const el = document.getElementById(link.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) current = link.id
        }
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ✅ Hide on scroll down, show on scroll up — Swiggy/Zomato style
  // Also tracks scroll progress bar + shadow
  useEffect(() => {
    const handleProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress || 0)
      setScrolled(scrollTop > 10)

      // Hide/show logic: only kick in after scrolling past 80px
      if (scrollTop < 80) {
        setVisible(true)
      } else if (scrollTop > lastScrollY.current + 6) {
        // Scrolling DOWN — hide
        setVisible(false)
        setMenuOpen(false) // close mobile menu when hiding
      } else if (scrollTop < lastScrollY.current - 4) {
        // Scrolling UP — show
        setVisible(true)
      }
      lastScrollY.current = scrollTop
    }

    window.addEventListener('scroll', handleProgress, { passive: true })
    return () => window.removeEventListener('scroll', handleProgress)
  }, [])

  const go = useCallback((link) => {
    const el = document.getElementById(link.id)

    if (el && location.pathname === '/') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate(link.path)
    }

    setMenuOpen(false)
  }, [navigate, location.pathname])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/')
  }, [logout, navigate])

  const isActive = (link) => {
    if (location.pathname === '/') return activeSection === link.id
    return location.pathname === link.path
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-all duration-300 ${
          scrolled ? 'shadow-lg' : 'shadow-sm'
        }`}
        style={{
          background:
            'linear-gradient(135deg, rgba(255,240,246,0.97) 0%, rgba(253,243,231,0.97) 60%, rgba(255,248,240,0.97) 100%)',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <button onClick={() => go(navLinks[0])} className="flex items-center gap-3">
            <img src={hkpgLogo} className="w-12 h-12 rounded-full border-2 border-pink-200" />
            <div className="hidden sm:block">
              <p className="font-extrabold text-gray-800 text-sm">HK PG</p>
              <p className="text-xs font-semibold text-pink-600">Boys Accommodation</p>
            </div>
          </button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => go(link)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold
                  ${isActive(link)
                    ? 'text-white shadow-md'
                    : 'text-gray-600 hover:bg-pink-50'}`}
                style={isActive(link) ? btnStyle : {}}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/student')}>
                  {user.name}
                </button>
                <button onClick={handleLogout} style={btnStyle} className="px-4 py-2 text-white rounded-xl">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')} style={btnStyle} className="px-4 py-2 text-white rounded-xl">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-pink-50 transition"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="text-gray-700 text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-pink-100 bg-white/98 backdrop-blur-md px-4 py-3 flex flex-col gap-1 shadow-lg">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => go(link)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive(link)
                    ? 'text-white shadow-sm'
                    : 'text-gray-600 hover:bg-pink-50'
                }`}
                style={isActive(link) ? { background: 'linear-gradient(135deg, #d63384, #c026d3)' } : {}}
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-1">
              {user ? (
                <>
                  <button
                    onClick={() => { navigate(user.role === 'admin' ? '/admin' : '/student'); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-pink-50 transition"
                  >
                    👤 {user.name}
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/login'); setMenuOpen(false) }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-pink-50 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate('/register'); setMenuOpen(false) }}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Scroll progress bar — positioned at bottom of header */}
        <div
          className="absolute bottom-0 left-0 h-[3px]"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #d63384, #c026d3)',
            transition: 'width 0.1s linear',
          }}
        />
      </header>
    </>
  )
}