import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import { AppToaster } from './components/Toast'
import { roomApi } from './services/api'

import HomePage          from './pages/HomePage'
import FacilitiesPage    from './pages/FacilitiesPage'
import AccommodationPage from './pages/AccommodationPage'
import GalleryPage       from './pages/GalleryPage'
import OffersPage        from './pages/OffersPage'
import RulesAndRegulationsPage from './pages/RulesAndRegulationsPage'
import PayRentPage       from './pages/PayRentPage'
import TestimonialsPage  from './pages/TestimonialsPage'
import ContactPage       from './pages/ContactPage'
import RoomDetailPage    from './pages/RoomDetailPage'
import StudentFormPage   from './pages/StudentFormPage'
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import StudentDashboard  from './pages/StudentDashboard'
import AdminDashboard    from './pages/AdminDashboard'

// ── Page transition variant — subtle fade + 6px upward slide ─────────────────
const pageVariants = {
  initial:  { opacity: 0, y: 6 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:     { opacity: 0, y: -4, transition: { duration: 0.15, ease: 'easeIn' } },
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}

// ── Floating WhatsApp Chat Button ─────────────────────────────────────────────
const WA_CHAT_LINK = `https://wa.me/919579828996?text=${encodeURIComponent(
  'Hi! I have a question about HK PG Boys Accommodation.'
)}`

function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <a
      href={WA_CHAT_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed z-50 flex items-center justify-center rounded-full shadow-2xl transition-all duration-500"
      style={{
        bottom: '24px',
        right: '20px',
        width: '58px',
        height: '58px',
        background: 'linear-gradient(135deg,#25d366,#128c7e)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.6)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="30" height="30">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.464A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.373l-.36-.214-3.713.894.924-3.638-.234-.374A9.818 9.818 0 1 1 12 21.818z"/>
      </svg>
      <span
        className="absolute rounded-full animate-ping"
        style={{ width: '58px', height: '58px', background: 'rgba(37,211,102,0.35)' }}
      />
    </a>
  )
}

function toMap(list) {
  const m = {}
  ;(list || []).forEach(rt => { m[rt.slug] = rt })
  return m
}

function AppRoutes() {
  const [rooms, setRooms]               = useState({})
  const [roomTypeKey, setRoomTypeKey]   = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const fetchRooms = useCallback(async () => {
    // Retry up to 3 times with increasing delays — silent, no user-facing messages
    const attempt = async (retryCount = 0) => {
      try {
        const res = await roomApi.getAll()
        setRooms(toMap(res.data))
      } catch (err) {
        if (retryCount < 3) {
          const delay = [5000, 10000, 20000][retryCount] // 5s, 10s, 20s
          console.warn(`[fetchRooms] attempt ${retryCount + 1} failed, retrying in ${delay/1000}s`)
          setTimeout(() => attempt(retryCount + 1), delay)
        } else {
          console.error('[fetchRooms] all retries failed:', err.message)
        }
      }
    }
    attempt()
  }, [])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const goToRoomDetail = (typeKey) => {
    setRoomTypeKey(typeKey)
    navigate(`/room/${typeKey}`)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const goToForm = (roomTypeDto) => {
    setSelectedRoom(roomTypeDto)
    navigate('/apply')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleBookingSubmit = useCallback(() => {
    fetchRooms()
  }, [fetchRooms])

  return (
    <div className="pt-[72px]">
      {/* Header rendered ONCE here — outside AnimatePresence/motion.div stacking context */}
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>

          {/* Public */}
          <Route path="/" element={
            <PageWrapper><HomePage /></PageWrapper>
          } />
          <Route path="/facilities" element={
            <PageWrapper><FacilitiesPage /></PageWrapper>
          } />
          <Route path="/accommodation" element={
            <PageWrapper>
              <AccommodationPage rooms={rooms} onBook={goToRoomDetail} onRoomUpdated={fetchRooms} />
            </PageWrapper>
          } />
          <Route path="/gallery" element={
            <PageWrapper><GalleryPage /></PageWrapper>
          } />
          <Route path="/offers" element={
            <PageWrapper><OffersPage /></PageWrapper>
          } />
          <Route path="/rules-and-regulations" element={
            <PageWrapper><RulesAndRegulationsPage /></PageWrapper>
          } />
          <Route path="/testimonials" element={
            <PageWrapper><TestimonialsPage /></PageWrapper>
          } />
          <Route path="/contact" element={
            <PageWrapper><ContactPage /></PageWrapper>
          } />

          {/* Room detail */}
          <Route path="/room/:typeKey" element={
            <PageWrapper>
              <RoomDetailPage onBook={goToForm} onBack={() => navigate('/accommodation')} />
            </PageWrapper>
          } />

          {/* Application form */}
          <Route path="/apply" element={
            <ProtectedRoute>
              <PageWrapper>
                <StudentFormPage
                  selectedRoom={selectedRoom}
                  onBack={() => navigate(roomTypeKey ? `/room/${roomTypeKey}` : '/accommodation')}
                  onSubmit={handleBookingSubmit}
                  onAfterSubmit={() => { fetchRooms(); navigate(`/room/${roomTypeKey}`) }}
                />
              </PageWrapper>
            </ProtectedRoute>
          } />

          {/* Auth */}
          <Route path="/login"            element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/register"         element={<PageWrapper><RegisterPage /></PageWrapper>} />
          <Route path="/forgot-password"  element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />

          {/* Dashboards */}
          <Route path="/student" element={
            <ProtectedRoute role="student">
              <PageWrapper><StudentDashboard /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/pay-rent" element={
            <ProtectedRoute role="student">
              <PageWrapper><PayRentPage /></PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <PageWrapper><AdminDashboard /></PageWrapper>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <PageWrapper>
              <div className="min-h-screen flex flex-col items-center justify-center gap-4"
                style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>
                <p className="text-6xl">🏠</p>
                <h1 className="text-2xl font-extrabold text-gray-800">Page Not Found</h1>
                <button onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}>
                  ← Back to Home
                </button>
              </div>
            </PageWrapper>
          } />

        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppToaster />
        <AppRoutes />
        <WhatsAppFloat />
      </AuthProvider>
    </BrowserRouter>
  )
}
