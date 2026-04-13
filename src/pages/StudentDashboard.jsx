import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../components/Toast'
import { roomApi, applicationApi } from '../services/api'

const ROOM_TYPES  = ['1-sharing', '2-sharing', '3-sharing', '4-sharing']
const ROOM_LABELS = { '1-sharing': '1 Sharing', '2-sharing': '2 Sharing', '3-sharing': '3 Sharing', '4-sharing': '4 Sharing' }

export default function StudentDashboard() {
  const { user, logout, updateProfile, uploadPhoto } = useAuth()
  const navigate = useNavigate()
  const [rooms, setRooms]         = useState({})
  const [myApplications, setMyApplications] = useState([])
  const [loading, setLoading]     = useState(true)
  const [editMode, setEditMode]   = useState(false)
  const [editForm, setEditForm]   = useState({ name: '', phone: '' })
  const [saving, setSaving]       = useState(false)
  const pollRef = useRef(null)

  const fetchRooms = useCallback(async () => {
    try {
      const [roomRes, appRes] = await Promise.all([
        roomApi.getAll(),
        applicationApi.getMyApplications(),
      ])
      const map = {}
      ;(roomRes.data || []).forEach(rt => { map[rt.slug] = rt })
      setRooms(map)
      setMyApplications(appRes.data || [])
    } catch (e) {
      showToast.error('Failed to Load Data', e.message || 'Could not fetch data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRooms()
    const interval = setInterval(fetchRooms, 30000)
    return () => clearInterval(interval)
  }, [fetchRooms])

  const handleLogout = () => {
    showToast.info('Logged Out', 'You have been signed out successfully.')
    setTimeout(() => { logout(); navigate('/', { replace: true }) }, 600)
  }

  const openEdit = () => {
    setEditForm({ name: user?.name || '', phone: user?.phone || '' })
    setEditMode(true)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (editForm.phone && !/^[0-9]{10}$/.test(editForm.phone)) {
      showToast.error('Invalid Phone', 'Phone must be exactly 10 digits.')
      return
    }
    setSaving(true)
    const id = showToast.loading('Saving...', 'Updating your profile.')
    const result = await updateProfile({ name: editForm.name, phone: editForm.phone })
    setSaving(false)
    if (!result.success) {
      showToast.update(id, 'error', 'Update Failed', result.error)
      return
    }
    showToast.update(id, 'success', 'Profile Updated ✅', 'Your name and phone have been saved.')
    setEditMode(false)
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const id = showToast.loading('Uploading Photo...', 'Please wait.')
    const result = await uploadPhoto(file)
    if (!result.success) {
      showToast.update(id, 'error', 'Upload Failed', result.error)
      return
    }
    showToast.update(id, 'success', 'Photo Updated ✅', 'Your profile photo has been saved.')
  }

  // Aggregate totals across all room types
  const totalStats = ROOM_TYPES.reduce((acc, key) => {
    const rt = rooms[key]
    if (rt) {
      acc.totalBeds    += rt.totalBeds    || 0
      acc.vacantBeds   += rt.vacantBeds   || 0
      acc.occupiedBeds += rt.occupiedBeds || 0
    }
    return acc
  }, { totalBeds: 0, vacantBeds: 0, occupiedBeds: 0 })

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
      <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm font-medium">Loading your dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="sticky top-0 z-40 shadow-sm px-4 h-16 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-extrabold text-gray-800 text-sm">{user?.name}</p>
            <p className="text-xs text-gray-400">Student Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-700">Live</span>
          </div>
          <button onClick={() => navigate('/')}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            🌐 Visit Website
          </button>
          <button onClick={handleLogout}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-800">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h1>
          <button onClick={fetchRooms}
            className="text-xs font-semibold text-pink-600 hover:text-pink-800 flex items-center gap-1 transition">
            🔄 Refresh
          </button>
        </div>

        {/* ── Profile Card ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-start gap-4">
            {/* Avatar / Photo */}
            <div className="relative flex-shrink-0">
              {user?.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-200 shadow" />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-extrabold shadow"
                  style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Upload button overlay */}
              <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition shadow">
                <span className="text-white text-xs">📷</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            {/* Info */}
            {!editMode ? (
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-gray-800 text-base">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  📞 {user?.phone || <span className="text-gray-300 italic">No phone added</span>}
                </p>
                <span className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="flex-1 space-y-2">
                <input type="text" placeholder="Full Name" value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400" />
                <input type="tel" placeholder="10-digit mobile" maxLength={10} value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400" />
                <div className="flex gap-2">
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
                    {saving ? 'Saving...' : '✅ Save'}
                  </button>
                  <button type="button" onClick={() => setEditMode(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!editMode && (
              <button onClick={openEdit}
                className="flex-shrink-0 text-xs font-semibold text-pink-600 hover:text-pink-800 transition">
                ✏️ Edit
              </button>
            )}
          </div>
        </div>

        {/* ── My Bookings ──────────────────────────────────────────────────── */}
        {myApplications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="font-extrabold text-gray-800 text-base mb-4">🛏️ My Room Bookings</h2>
            <div className="space-y-3">
              {myApplications.map(a => (
                <div key={a.id} className={`rounded-xl border p-4 ${
                  a.status === 'CONFIRMED' ? 'border-green-200 bg-green-50' :
                  a.status === 'REJECTED'  ? 'border-red-200 bg-red-50' :
                  'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-800 text-sm">{a.roomTypeTitle}</p>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      a.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      a.status === 'REJECTED'  ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{a.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span>🚪 Room: <strong>{a.roomNumber || '—'}</strong></span>
                    <span>🔢 Bed: <strong>{a.bedNumber ? `Bed ${a.bedNumber}` : '—'}</strong></span>
                    <span>📅 Joining: <strong>{a.joiningDate}</strong></span>
                    <span>⏱️ Duration: <strong>{a.durationMonths} month{a.durationMonths > 1 ? 's' : ''}</strong></span>
                  </div>
                  {a.adminNotes && (
                    <p className="text-xs text-gray-500 mt-2 italic">📝 Admin note: {a.adminNotes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Beds',    value: totalStats.totalBeds,    color: 'text-gray-800',  bg: 'bg-gray-50',  border: 'border-gray-200',  icon: '🛏️' },
            { label: 'Vacant Beds',   value: totalStats.vacantBeds,   color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: '✅' },
            { label: 'Occupied Beds', value: totalStats.occupiedBeds, color: 'text-red-500',   bg: 'bg-red-50',   border: 'border-red-200',   icon: '🔴' },
          ].map(c => (
            <div key={c.label} className={`${c.bg} border ${c.border} rounded-2xl p-5 flex flex-col gap-1`}>
              <span className="text-2xl">{c.icon}</span>
              <p className={`text-3xl font-extrabold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-500 font-medium">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Room-wise vacancy */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-gray-800 text-base">🏠 Room-wise Vacancy</h2>
            <span className="text-xs text-gray-400">Click a room to view details</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ROOM_TYPES.map(key => {
              const rt = rooms[key]
              if (!rt) return (
                <div key={key} className="border border-gray-100 rounded-xl p-4 animate-pulse bg-gray-50">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              )
              const pct = rt.totalBeds > 0 ? Math.round((rt.occupiedBeds / rt.totalBeds) * 100) : 0
              return (
                <button
                  key={key}
                  onClick={() => navigate(`/room/${key}`)}
                  className="border border-gray-100 rounded-xl p-4 text-left hover:shadow-md hover:border-pink-200 transition group"
                >
                  <p className="font-bold text-gray-700 text-sm group-hover:text-pink-600 transition">
                    {ROOM_LABELS[key]}
                  </p>
                  <p className={`text-2xl font-extrabold mt-1 ${rt.vacantBeds > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {rt.vacantBeds}
                  </p>
                  <p className="text-xs text-gray-400">of {rt.totalBeds} beds vacant</p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{pct}% occupied</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contact Owner & Support */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-extrabold text-gray-800 text-base mb-4">📞 Contact Owner & Support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="tel:9579828996"
              className="border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>📞</div>
              <div>
                <p className="text-xs text-gray-400">Owner Direct</p>
                <p className="font-extrabold text-gray-800 text-sm group-hover:text-pink-600 transition">9579828996</p>
              </div>
            </a>
            <a href="tel:9096398032"
              className="border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>📞</div>
              <div>
                <p className="text-xs text-gray-400">Warden Direct</p>
                <p className="font-extrabold text-gray-800 text-sm group-hover:text-pink-600 transition">9096398032</p>
              </div>
            </a>
            <a href="https://wa.me/919579828996" target="_blank" rel="noreferrer"
              className="border border-green-100 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 bg-green-500">💬</div>
              <div>
                <p className="text-xs text-gray-400">WhatsApp</p>
                <p className="font-extrabold text-gray-800 text-sm group-hover:text-green-600 transition">Chat with Owner</p>
              </div>
            </a>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
          📢 <strong>Notice:</strong> Rent for May 2026 is due by 5th May. Please pay on time to avoid late fees.
        </div>

      </div>
    </div>
  )
}
