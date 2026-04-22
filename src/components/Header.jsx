import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Cloudinary-hosted logo — new HK PG logo with peacock feather
// Upload the new logo to Cloudinary and replace this URL
const LOGO_URL = 'https://res.cloudinary.com/dzr0crkvr/image/upload/q_auto,f_auto,w_200/hkpg/logo/hkpg-new-logo.png'

const navLinks = [
  { label: 'Home',          path: '/', id: 'home' },
  { label: 'Facilities',    path: '/facilities', id: 'facilities' },
  { label: 'Accommodation', path: '/accommodation', id: 'accommodation' },
  { label: 'Gallery',       path: '/gallery', id: 'gallery' },
  { label: 'Offers',        path: '/offers', id: 'offers' },
  { label: 'Testimonials',  path: '/testimonials', id: 'testimonials' },
  { label: 'Contact Us',    path: '/contact', id: 'contact' },
]

export default function Header() {
  const [menuOpen,       setMenuOpen]       = useState(false)
  const [activeSection,  setActiveSection]  = useState('home')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrolled,       setScrolled]       = useState(false)
  const [visible,        setVisible]        = useState(true)
  const [logoError,      setLogoError]      = useState(false)
  const lastScrollY = useRef(0)
  const ticking    = useRef(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const gradientBtn = { background: 'linear-gradient(135deg, #d63384, #c026d3)' }

  // ── Active section detection (home page only) ─────────────────────────────
  useEffect(() => {
    const detect = () => {
      let current = 'home'
      navLinks.forEach(link => {
        const el = document.getElementById(link.id)
        if (el && el.getBoundingClientRect().top <= 120) current = link.id
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', detect, { passive: true })
    return () => window.removeEventListener('scroll', detect)
  }, [])

  // ── Scroll progress + hide/show logic ────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0)
      setScrolled(scrollTop > 20)

      const diff = scrollTop - lastScrollY.current
      if (scrollTop <= 0) {
        setVisible(true)
      } else if (diff > 3) {
        setVisible(false)
        setMenuOpen(false)
      } else if (diff < -1) {
        setVisible(true)
      }
      lastScrollY.current = scrollTop
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(update)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

  // Fallback logo — local asset if Cloudinary fails
  const logoSrc = logoError ? '/hkpg-logo.png' : LOGO_URL

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-link-hover { position: relative; }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #d63384, #c026d3);
          border-radius: 2px;
          transition: width 0.3s ease, left 0.3s ease;
        }
        .nav-link-hover:hover::after { width: 80%; left: 10%; }
        .nav-link-active::after { width: 80% !important; left: 10% !important; }
      `}</style>

      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%',
          zIndex: 50,
          background: scrolled
            ? 'rgba(255, 245, 250, 0.94)'
            : 'rgba(255, 245, 250, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(208,35,132,0.18)'
            : '1px solid rgba(208,35,132,0.08)',
          boxShadow: scrolled
            ? '0 4px 30px rgba(208,35,132,0.12), 0 1px 0 rgba(255,255,255,0.6) inset'
            : '0 2px 10px rgba(0,0,0,0.04)',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          transition: visible
            ? 'transform 0.22s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s ease, background 0.3s ease'
            : 'transform 0.3s cubic-bezier(0.55,0.085,0.68,0.53)',
          willChange: 'transform',
        }}
      >
        {/* ── Main bar — height increased to 90px for proper logo circle ─────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-3"
          style={{ height: '90px' }}>

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <button
            onClick={() => go(navLinks[0])}
            className="flex items-center gap-3 group"
            aria-label="HK PG Home"
          >
            <img
              src={logoSrc}
              alt="HK PG Logo"
              width={80}
              height={80}
              style={{ 
                width: 80, 
                height: 80, 
                objectFit: 'contain', 
                display: 'block',
                borderRadius: '50%'
              }}
              onError={() => setLogoError(true)}
            />
            <div className="hidden sm:block leading-tight">
              <p className="font-extrabold text-gray-800" style={{ fontSize: 15, letterSpacing: '-0.01em' }}>HK PG</p>
              <p className="text-xs font-semibold" style={{ color: '#c026d3', letterSpacing: '0.01em' }}>Boys Accommodation</p>
            </div>
          </button>

          {/* ── Desktop Nav ───────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => go(link)}
                className={`nav-link-hover px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link) ? 'nav-link-active' : ''
                }`}
                style={
                  isActive(link)
                    ? {
                        ...gradientBtn,
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(208,35,132,0.35)',
                        transform: 'scale(1.04)',
                      }
                    : { color: '#374151' }
                }
                onMouseEnter={e => {
                  if (!isActive(link)) {
                    e.currentTarget.style.color = '#c026d3'
                    e.currentTarget.style.background = 'rgba(192,38,211,0.06)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(link)) {
                    e.currentTarget.style.color = '#374151'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* ── Auth Buttons ──────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => navigate(user.role === 'admin' ? '/admin' : '/student')}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-200 flex items-center gap-1.5"
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,38,211,0.06)'; e.currentTarget.style.color = '#c026d3' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151' }}
                >
                  {user.role === 'admin' ? (
                    // Admin: show shield icon only — never expose admin name in public header
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Admin Panel
                    </>
                  ) : (
                    // Student: show person icon + name
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      {user.name}
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  style={gradientBtn}
                  className="px-4 py-2 text-white rounded-xl text-sm font-semibold transition-all duration-200"
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-200"
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,38,211,0.06)'; e.currentTarget.style.color = '#c026d3' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151' }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  style={gradientBtn}
                  className="px-4 py-2 text-white rounded-xl text-sm font-semibold transition-all duration-200"
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* ── Hamburger (md and below) ───────────────────────────────── */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-200"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{ background: menuOpen ? 'rgba(192,38,211,0.08)' : 'transparent' }}
          >
            <span style={{
              display: 'block', width: '20px', height: '2px', borderRadius: '2px',
              background: '#374151',
              transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
              transition: 'transform 0.25s ease',
            }} />
            <span style={{
              display: 'block', width: '20px', height: '2px', borderRadius: '2px',
              background: '#374151',
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 0.2s ease',
            }} />
            <span style={{
              display: 'block', width: '20px', height: '2px', borderRadius: '2px',
              background: '#374151',
              transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
              transition: 'transform 0.25s ease',
            }} />
          </button>
        </div>

        {/* ── Mobile Menu ───────────────────────────────────────────────── */}
        <div style={{
          overflow: 'hidden',
          maxHeight: menuOpen ? '520px' : '0',
          opacity: menuOpen ? 1 : 0,
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
          borderTop: menuOpen ? '1px solid rgba(208,35,132,0.1)' : 'none',
          background: 'rgba(255,245,250,0.97)',
          backdropFilter: 'blur(20px)',
        }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <button
                key={link.path}
                onClick={() => go(link)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  ...(isActive(link)
                    ? { ...gradientBtn, color: 'white', boxShadow: '0 3px 10px rgba(208,35,132,0.25)' }
                    : { color: '#374151' }),
                  animation: menuOpen ? `slideDown 0.3s ease ${i * 40}ms both` : 'none',
                }}
              >
                {link.label}
              </button>
            ))}

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '6px', paddingTop: '6px' }}
              className="flex flex-col gap-1">
              {user ? (
                <>
                  <button
                    onClick={() => { navigate(user.role === 'admin' ? '/admin' : '/student'); setMenuOpen(false) }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600"
                    style={{ animation: menuOpen ? 'slideDown 0.3s ease 280ms both' : 'none' }}
                  >
                    {user.role === 'admin' ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }}>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Admin Panel
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }}>
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        {user.name}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ ...gradientBtn, animation: menuOpen ? 'slideDown 0.3s ease 320ms both' : 'none' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/login'); setMenuOpen(false) }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-600"
                    style={{ animation: menuOpen ? 'slideDown 0.3s ease 280ms both' : 'none' }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate('/register'); setMenuOpen(false) }}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ ...gradientBtn, animation: menuOpen ? 'slideDown 0.3s ease 320ms both' : 'none' }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Scroll Progress Bar ───────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0,
            height: '3px',
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #d63384, #c026d3, #e879f9)',
            boxShadow: scrollProgress > 2 ? '0 0 8px rgba(208,35,132,0.6)' : 'none',
            borderRadius: '0 3px 3px 0',
            transition: 'width 0.15s linear',
          }}
        />
      </header>
    </>
  )
}
