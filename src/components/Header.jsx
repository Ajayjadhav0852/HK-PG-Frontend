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
  const [showHeader, setShowHeader] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

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

  // ✅ Hide / show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY

      if (currentScroll < 50) {
        setShowHeader(true)
      } else if (currentScroll > lastScrollY.current) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }

      lastScrollY.current = currentScroll
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ✅ Scroll progress bar
  useEffect(() => {
    const handleProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress || 0)
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
        className="fixed top-0 left-0 w-full z-50 shadow-sm backdrop-blur-md transition-transform duration-300"
        style={{
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
          background:
            'linear-gradient(135deg, rgba(255,240,246,0.97) 0%, rgba(253,243,231,0.97) 60%, rgba(255,248,240,0.97) 100%)',
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

          {/* Mobile */}
          <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}>
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t p-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => go(link)}
                className={`${isActive(link) ? 'text-pink-600 font-bold' : ''}`}
              >
                {link.label}
              </button>
            ))}
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