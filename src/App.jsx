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
  const fetchingRef = useRef(false) // ✅ prevent duplicate calls

  const fetchRooms = useCallback(async () => {
    if (fetchingRef.current) return // ✅ avoid multiple calls
    fetchingRef.current = true

    try {
      const res = await roomApi.getAll()
      setRooms(prev => {
        const newData = toMap(res.data)

        // ✅ prevent unnecessary re-render
        if (JSON.stringify(prev) === JSON.stringify(newData)) return prev
        return newData
      })
    } catch (e) {
      console.log('Room fetch failed:', e.message)
    } finally {
      fetchingRef.current = false
    }
  }, [])

  // ✅ SMART polling (only when tab active)
  useEffect(() => {
    fetchRooms()

    const startPolling = () => {
      if (!pollRef.current) {
        pollRef.current = setInterval(fetchRooms, 60000) // 🔥 reduced to 60s
      }
    }

    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }

    startPolling()

    const handleVisibility = () => {
      if (document.hidden) stopPolling()
      else {
        fetchRooms()
        startPolling()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
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
    fetchRooms() // ✅ refresh only when needed
  }, [fetchRooms])

  return (
    <Routes>
      <Route path="/"              element={<><Header /><HomePage /></>} />
      <Route path="/facilities"    element={<><Header /><FacilitiesPage /></>} />
      <Route path="/accommodation" element={<><Header /><AccommodationPage rooms={rooms} onBook={goToRoomDetail} onRoomUpdated={fetchRooms} /></>} />
      <Route path="/testimonials"  element={<><Header /><TestimonialsPage /></>} />
      <Route path="/contact"       element={<><Header /><ContactPage /></>} />

      <Route path="/room/:typeKey" element={
        <><Header /><RoomDetailPage onBook={goToForm} onBack={() => navigate('/accommodation')} /></>
      } />

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

      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/student" element={
        <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />

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