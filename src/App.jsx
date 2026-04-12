import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { roomsData } from './data/roomsData'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'

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

function initRooms() {
  return JSON.parse(JSON.stringify(roomsData))
}

export function computeStats(typeData) {
  const totalRooms    = typeData.rooms.length
  const totalBeds     = totalRooms * typeData.bedsPerRoom
  const occupiedBeds  = typeData.rooms.reduce((sum, r) => sum + r.occupiedBeds, 0)
  const vacantBeds    = totalBeds - occupiedBeds
  const vacantRooms   = typeData.rooms.filter(r => r.occupiedBeds < typeData.bedsPerRoom).length
  return { totalRooms, totalBeds, occupiedBeds, vacantBeds, vacantRooms }
}

// Pages that show the Header
const PUBLIC_PATHS = ['/', '/facilities', '/accommodation', '/testimonials', '/contact', '/room', '/apply']

function AppRoutes() {
  const [rooms, setRooms]           = useState(initRooms)
  const [roomTypeKey, setRoomTypeKey] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const navigate = useNavigate()

  const goToRoomDetail = (typeKey) => {
    setRoomTypeKey(typeKey)
    navigate(`/room/${typeKey}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToForm = (room) => {
    setSelectedRoom(room)
    navigate('/apply')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBookingSubmit = () => {
    if (!roomTypeKey) return
    setRooms(prev => {
      const updated = JSON.parse(JSON.stringify(prev))
      const typeRooms  = updated[roomTypeKey].rooms
      const bedsPerRoom = updated[roomTypeKey].bedsPerRoom
      const target = typeRooms.find(r => r.occupiedBeds < bedsPerRoom)
      if (target) target.occupiedBeds += 1
      return updated
    })
  }

  return (
    <Routes>
      {/* ── Public routes (with Header) ── */}
      <Route path="/" element={<><Header /><HomePage /></>} />
      <Route path="/facilities"    element={<><Header /><FacilitiesPage /></>} />
      <Route path="/accommodation" element={<><Header /><AccommodationPage rooms={rooms} onBook={goToRoomDetail} /></>} />
      <Route path="/testimonials"  element={<><Header /><TestimonialsPage /></>} />
      <Route path="/contact"       element={<><Header /><ContactPage /></>} />
      <Route path="/room/:typeKey" element={<><Header /><RoomDetailPage rooms={rooms} onBook={goToForm} onBack={() => navigate('/accommodation')} /></>} />
      <Route path="/apply"         element={<><Header /><StudentFormPage
        selectedRoom={selectedRoom}
        onBack={() => navigate(roomTypeKey ? `/room/${roomTypeKey}` : '/accommodation')}
        onSubmit={handleBookingSubmit}
        onAfterSubmit={() => navigate(`/room/${roomTypeKey}`)}
      /></>} />

      {/* ── Auth routes (no Header) ── */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Protected: Student ── */}
      <Route path="/student" element={
        <ProtectedRoute role="student"><StudentDashboard rooms={rooms} /></ProtectedRoute>
      } />

      {/* ── Protected: Admin ── */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
