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
  const ticking = useRef(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const btnStyle = { background: 'linear-gradient(135deg, #d63384, #c026d3)' }

  // ✅ Active section detection
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
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 🚀 Enhanced sticky header with instant accessibility
  useEffect(() => {
    const updateScrollState = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      
      setScrollProgress(progress || 0)
      setScrolled(scrollTop > 20)

      // Smart sticky behavior - always accessible when needed
      const scrollDiff = scrollTop - lastScrollY.current
      
      if (scrollTop < 50) {
        // Always show header at top of page
        setVisible(true)
      } else if (scrollDiff > 5 && scrollTop > 100) {
        // Scrolling DOWN - hide header quickly (small threshold for quick hiding)
        setVisible(false)
        setMenuOpen(false) // Close mobile menu when hiding
      } else if (scrollDiff < -2) {
        // Scrolling UP - show header INSTANTLY (very small threshold for immediate access)
        setVisible(true)
      }
      
      lastScrollY.current = scrollTop
      ticking.current = false
    }

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollState)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg transition-all duration-300 ease-out ${
          scrolled ? 'shadow-2xl' : 'shadow-md'
        }`}
        style={{
          background: scrolled
            ? 'linear-gradient(135deg, rgba(255,240,246,0.97) 0%, rgba(253,243,231,0.97) 60%, rgba(255,248,240,0.97) 100%)'
            : 'linear-gradient(135deg, rgba(255,240,246,0.92) 0%, rgba(253,243,231,0.92) 60%, rgba(255,248,240,0.92) 100%)',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(-100%) scale(0.98)',
          transformOrigin: 'center top',
          transition: visible 
            ? 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Faster show (immediate access)
            : 'all 0.35s cubic-bezier(0.55, 0.085, 0.68, 0.53)', // Slightly slower hide
          willChange: 'transform',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Logo with enhanced hover effect */}
          <button 
            onClick={() => go(navLinks[0])} 
            className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
          >
            <img 
              src={hkpgLogo} 
              className="w-12 h-12 rounded-full border-2 border-pink-200 transition-all duration-300 hover:border-pink-300 hover:shadow-lg" 
            />
            <div className="hidden sm:block">
              <p className="font-extrabold text-gray-800 text-sm transition-colors duration-300">HK PG</p>
              <p className="text-xs font-semibold text-pink-600 transition-colors duration-300">Boys Accommodation</p>
            </div>
          </button>

          {/* Enhanced Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => go(link)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive(link)
                    ? 'text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
                }`}
                style={isActive(link) ? { ...btnStyle, boxShadow: '0 4px 15px rgba(208, 35, 132, 0.3)' } : {}}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Enhanced Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <button 
                  onClick={() => navigate(user.role === 'admin' ? '/admin' : '/student')}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-50 transition-all duration-300 hover:scale-105"
                >
                  👤 {user.name}
                </button>
                <button 
                  onClick={handleLogout} 
                  style={btnStyle} 
                  className="px-4 py-2 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-50 transition-all duration-300 hover:scale-105"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')} 
                  style={btnStyle} 
                  className="px-4 py-2 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-pink-50 transition-all duration-300 hover:scale-110"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="text-gray-700 text-xl transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>

        {/* Enhanced Mobile menu with slide animation */}
        <div 
          className={`md:hidden border-t border-pink-100 bg-white/98 backdrop-blur-md px-4 py-3 flex flex-col gap-1 shadow-lg transition-all duration-400 ease-out overflow-hidden ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ 
            transform: menuOpen ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {navLinks.map((link, index) => (
            <button
              key={link.path}
              onClick={() => go(link)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                isActive(link)
                  ? 'text-white shadow-sm scale-105'
                  : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
              }`}
              style={{ 
                ...(isActive(link) ? { background: 'linear-gradient(135deg, #d63384, #c026d3)' } : {}),
                animationDelay: `${index * 50}ms`,
                animation: menuOpen ? 'slideInLeft 0.3s ease-out forwards' : 'none'
              }}
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-1">
            {user ? (
              <>
                <button
                  onClick={() => { navigate(user.role === 'admin' ? '/admin' : '/student'); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-pink-50 transition-all duration-300 hover:scale-105"
                >
                  👤 {user.name}
                </button>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-pink-50 transition-all duration-300 hover:scale-105"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/register'); setMenuOpen(false) }}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Enhanced scroll progress bar with glow effect */}
        <div
          className="absolute bottom-0 left-0 h-1 transition-all duration-200 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #d63384, #c026d3, #e879f9)',
            boxShadow: scrollProgress > 0 ? '0 0 10px rgba(208, 35, 132, 0.5)' : 'none',
            borderRadius: '0 2px 2px 0'
          }}
        />
      </header>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}