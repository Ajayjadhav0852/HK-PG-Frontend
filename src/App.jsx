import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import { AppToaster } from './components/Toast'
import { roomApi } from './services/api'

import HomePage          from './pages/HomePage'
import FacilitiesPage    from './pages/FacilitiesPage'
import AccommodationPage from './pages/AccommodationPage'
import TestimonialsPage  from './pages/TestimonialsPage'
import ContactPage       from './pages/ContactPage'
import RoomDetailPage    from './pages/RoomDetailPage'
import StudentFormPage   from './pages/StudentFormPage'
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import StudentDashboard  from './pages/StudentDashboard'
import AdminDashboard    from './pages/AdminDashboard'

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
  const pollRef  = useRef(null)

  const fetchRooms = useCallback(async () => {
    try {
      const res = await roomApi.getAll()
      setRooms(toMap(res.data))
    } catch (e) {
      // Silent fail — rooms will show skeleton state
    }
  }, [])

  // Initial load + poll every 30s
  useEffect(() => {
    fetchRooms()
    pollRef.current = setInterval(fetchRooms, 30000)
    return () => clearInterval(pollRef.current)
  }, [fetchRooms])

  const goToRoomDetail = (typeKey) => {
    setRoomTypeKey(typeKey)
    navigate(`/room/${typeKey}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToForm = (roomTypeDto) => {
    setSelectedRoom(roomTypeDto)
    navigate('/apply')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBookingSubmit = useCallback(() => {
    fetchRooms()
  }, [fetchRooms])

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/"              element={<><Header /><HomePage /></>} />
      <Route path="/facilities"    element={<><Header /><FacilitiesPage /></>} />
      <Route path="/accommodation" element={<><Header /><AccommodationPage rooms={rooms} onBook={goToRoomDetail} onRoomUpdated={fetchRooms} /></>} />
      <Route path="/testimonials"  element={<><Header /><TestimonialsPage /></>} />
      <Route path="/contact"       element={<><Header /><ContactPage /></>} />

      {/* Room detail — fetches its own live data */}
      <Route path="/room/:typeKey" element={
        <><Header /><RoomDetailPage onBook={goToForm} onBack={() => navigate('/accommodation')} /></>
      } />

      {/* Application form — requires login */}
      <Route path="/apply" element={
        <ProtectedRoute>
          <><Header /><StudentFormPage
            selectedRoom={selectedRoom}
            onBack={() => navigate(roomTypeKey ? `/room/${roomTypeKey}` : '/accommodation')}
            onSubmit={handleBookingSubmit}
            onAfterSubmit={() => { fetchRooms(); navigate(`/room/${roomTypeKey}`) }}
          /></>
        </ProtectedRoute>
      } />

      {/* Auth */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected dashboards */}
      <Route path="/student" element={
        <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />

      {/* 404 fallback */}
      <Route path="*" element={
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
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppToaster />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
