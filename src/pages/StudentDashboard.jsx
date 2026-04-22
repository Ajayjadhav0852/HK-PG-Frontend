import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../components/Toast'
import { roomApi, applicationApi } from '../services/api'
import UPIPaymentScreen from '../components/UPIPaymentScreen'

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
  // Vacating form state
  const [showVacateForm, setShowVacateForm] = useState(false)
  const [vacateForm, setVacateForm] = useState({
    vacatingDate: '',
    reason: '',
    message: '',
  })
  const [vacateLoading, setVacateLoading] = useState(false)
  // Pay Rent state
  const [showPayRent, setShowPayRent] = useState(false)
  const pollRef = useRef(null)

  const fetchRooms = useCallback(async (silent = false) => {
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
      if (!silent) {
        // Don't show error on first load — server may be waking up (Render free tier)
        // Silently retry after 8 seconds
        setTimeout(() => fetchRooms(false), 8000)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRooms(false)
    const interval = setInterval(() => fetchRooms(true), 30000)
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

  const [slowLoad, setSlowLoad] = useState(false)

  useEffect(() => {
    // If still loading after 5s, show "waking up server" message
    const t = setTimeout(() => setSlowLoad(true), 5000)
    return () => clearTimeout(t)
  }, [])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
      <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm font-medium">Loading your dashboard...</p>
      {slowLoad && (
        <div className="text-center max-w-xs">
          <p className="text-xs text-gray-400">⏳ Server is waking up — this takes ~30 seconds on first load.</p>
          <p className="text-xs text-gray-400 mt-1">Please wait, your data will appear shortly.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="sticky top-0 z-40 shadow-sm px-4 h-16 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          {(user?.profilePhotoUrl || myApplications[0]?.profilePhotoUrl) ? (
            <img
              src={user?.profilePhotoUrl || myApplications[0]?.profilePhotoUrl}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-pink-200" />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
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
              {/* Show user profile photo OR photo from latest application */}
              {(user?.profilePhotoUrl || myApplications[0]?.profilePhotoUrl) ? (
                <img
                  src={user?.profilePhotoUrl || myApplications[0]?.profilePhotoUrl}
                  alt={user.name}
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
                {/* Name only editable if no confirmed booking */}
                {!myApplications.some(a => a.status === 'CONFIRMED') && (
                  <input type="text" placeholder="Full Name" value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400" />
                )}
                {/* Mobile always editable */}
                <input type="tel" placeholder="10-digit mobile" maxLength={10} value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-400" />
                {myApplications.some(a => a.status === 'CONFIRMED') && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
                    ⚠️ Name locked after booking confirmed. Only mobile & photo can be updated.
                  </p>
                )}
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

        {/* ── Payment Status ────────────────────────────────────────────────── */}
        {myApplications.some(a => a.status === 'CONFIRMED') && (() => {
          const confirmedApp = myApplications.find(a => a.status === 'CONFIRMED')
          const depositStatus = confirmedApp?.depositStatus || 'PENDING'
          const rentStatus    = confirmedApp?.rentStatus    || 'PENDING'

          const statusConfig = {
            RECEIVED: { label: '✅ Received',  bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
            OVERDUE:  { label: '🔴 Overdue',   bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-600',   badge: 'bg-red-100 text-red-600' },
            PENDING:  { label: '⏳ Pending',   bg: 'bg-yellow-50', border: 'border-yellow-200',text: 'text-yellow-700',badge: 'bg-yellow-100 text-yellow-700' },
          }

          const dep = statusConfig[depositStatus] || statusConfig.PENDING
          const ren = statusConfig[rentStatus]    || statusConfig.PENDING

          return (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="font-extrabold text-gray-800 text-base mb-4">💰 Payment Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Deposit */}
                <div className={`rounded-xl border p-4 ${dep.bg} ${dep.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-gray-700">🏦 Security Deposit</p>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${dep.badge}`}>
                      {dep.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Amount: <strong>₹{Number(confirmedApp?.depositAmount || 0).toLocaleString('en-IN')}</strong>
                  </p>
                  {depositStatus === 'RECEIVED' && (
                    <p className="text-xs text-green-600 mt-1 font-semibold">✓ Deposit confirmed by admin</p>
                  )}
                  {depositStatus === 'OVERDUE' && (
                    <p className="text-xs text-red-600 mt-1 font-semibold">⚠️ Please pay your deposit immediately</p>
                  )}
                  {depositStatus === 'PENDING' && (
                    <p className="text-xs text-yellow-600 mt-1">Awaiting admin confirmation</p>
                  )}
                </div>

                {/* Rent */}
                <div className={`rounded-xl border p-4 ${ren.bg} ${ren.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-gray-700">💸 Monthly Rent</p>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ren.badge}`}>
                      {ren.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Monthly: <strong>₹{Number(confirmedApp?.monthlyPrice || 0).toLocaleString('en-IN')}</strong>
                  </p>
                  {rentStatus === 'RECEIVED' && (
                    <p className="text-xs text-green-600 mt-1 font-semibold">✓ Last rent payment confirmed</p>
                  )}
                  {rentStatus === 'OVERDUE' && (
                    <p className="text-xs text-red-600 mt-1 font-semibold">⚠️ Rent overdue — pay before 5th to avoid late fees</p>
                  )}
                  {rentStatus === 'PENDING' && (
                    <p className="text-xs text-yellow-600 mt-1">Due before 5th of every month</p>
                  )}
                </div>

              </div>

              {/* Note */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-700">
                  📌 <strong>Note:</strong> Always pay rent through the HK PG application only. 
                  Admin updates your payment status after verification.
                </p>
              </div>
            </div>
          )
        })()}

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

        {/* Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
          📢 <strong>Notice:</strong> Rent for every month is due before the <strong>5th day of the month</strong>. Please pay on time to avoid late fees.
        </div>

        {/* ── Pay Rent ─────────────────────────────────────────────────────── */}
        {(() => {
          // Find confirmed application to get room & monthly price
          const confirmedApp = myApplications.find(a => a.status === 'CONFIRMED')
          const confirmedRoom = confirmedApp ? rooms[confirmedApp.roomTypeSlug] : null
          const monthlyRent = confirmedRoom?.monthlyPrice || confirmedApp?.monthlyPrice || null
          const isEligible = !!confirmedApp  // only show if admin confirmed

          if (showPayRent && confirmedApp) {
            return (
              <div>
                <button
                  onClick={() => setShowPayRent(false)}
                  className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition"
                >
                  ← Back to Dashboard
                </button>
                <UPIPaymentScreen
                  amount={monthlyRent}
                  upiId="9579828996@ybl"
                  upiName="Krishna Pandurang Pawar"
                  selectedRoom={confirmedRoom ? {
                    title: confirmedApp.roomTypeTitle,
                    monthlyPrice: monthlyRent,
                  } : null}
                  showToast={showToast}
                  onIPaid={() => {
                    setShowPayRent(false)
                    showToast.success('Rent Payment Done ✅', 'Your payment has been sent to admin via WhatsApp for verification.')
                  }}
                  rentMode={true}
                />
              </div>
            )
          }
          return (
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-extrabold text-gray-800 text-base">💸 Pay Monthly Rent</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isEligible
                      ? `${confirmedApp.roomTypeTitle} · ₹${Number(monthlyRent || 0).toLocaleString('en-IN')}/month`
                      : 'Available after admin confirms your booking'
                    }
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!isEligible) {
                      showToast.warning('Not Available', 'Pay Rent is available only after admin confirms your booking.')
                      return
                    }
                    navigate('/pay-rent', {
                      state: {
                        confirmedApp,
                        monthlyRent,
                        confirmedRoom,
                      }
                    })
                  }}
                  disabled={!isEligible}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: isEligible ? 'linear-gradient(135deg, #d63384, #c026d3)' : '#9ca3af' }}
                >
                  {isEligible ? '💳 Pay Rent' : '🔒 Locked'}
                </button>
              </div>

              {/* Status indicator */}
              {!isEligible && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                  <span>🔒</span>
                  <span>
                    {myApplications.length === 0
                      ? 'No booking found. Apply for a room first.'
                      : 'Your booking is pending admin approval. Pay Rent unlocks after confirmation.'
                    }
                  </span>
                </div>
              )}

              {isEligible && (
                <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-xl px-3 py-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Booking confirmed · Room {confirmedApp.roomNumber} · Bed {confirmedApp.bedNumber}</span>
                </div>
              )}
            </div>
          )
        })()}

        {/* ── Vacating / Leave Application ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-gray-800 text-base">🚪 Apply to Vacate PG</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {myApplications.some(a => a.status === 'CONFIRMED')
                  ? 'Submit a formal notice before leaving'
                  : 'Available after admin confirms your booking'
                }
              </p>
            </div>
            <button
              onClick={() => {
                if (!myApplications.some(a => a.status === 'CONFIRMED')) {
                  showToast.warning('Not Available', 'Apply to Vacate is available only after admin confirms your booking.')
                  return
                }
                setShowVacateForm(v => !v)
              }}
              disabled={!myApplications.some(a => a.status === 'CONFIRMED')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: showVacateForm ? '#6b7280' : (myApplications.some(a => a.status === 'CONFIRMED') ? 'linear-gradient(135deg, #d63384, #c026d3)' : '#9ca3af') }}
            >
              {myApplications.some(a => a.status === 'CONFIRMED') 
                ? (showVacateForm ? 'Cancel' : '+ Apply to Vacate')
                : '🔒 Locked'
              }
            </button>
          </div>

          {/* Status indicator */}
          {!myApplications.some(a => a.status === 'CONFIRMED') && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
              <span>🔒</span>
              <span>
                {myApplications.length === 0
                  ? 'No booking found. Apply for a room first.'
                  : 'Your booking is pending admin approval. Apply to Vacate unlocks after confirmation.'
                }
              </span>
            </div>
          )}

          {showVacateForm && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!vacateForm.vacatingDate) { showToast.error('Date Required', 'Please select your vacating date.'); return }
                if (!vacateForm.reason) { showToast.error('Reason Required', 'Please select a reason.'); return }
                if (!vacateForm.message.trim() || vacateForm.message.trim().length < 20) {
                  showToast.error('Message Too Short', 'Please write at least 20 characters explaining your reason.')
                  return
                }
                setVacateLoading(true)
                const msg = encodeURIComponent(
                  `🚪 *Vacating Application*\n\n` +
                  `*Student:* ${user?.name}\n` +
                  `*Email:* ${user?.email}\n` +
                  `*Phone:* ${user?.phone || 'N/A'}\n` +
                  `*Vacating Date:* ${vacateForm.vacatingDate}\n` +
                  `*Reason:* ${vacateForm.reason}\n\n` +
                  `*Message:*\n${vacateForm.message}\n\n` +
                  `Please acknowledge this notice. Thank you.`
                )
                window.open(`https://wa.me/919579828996?text=${msg}`, '_blank')
                await new Promise(r => setTimeout(r, 500))
                setVacateLoading(false)
                showToast.success('Notice Sent ✅', 'Your vacating notice has been sent to the admin via WhatsApp.')
                setVacateForm({ vacatingDate: '', reason: '', message: '' })
                setShowVacateForm(false)
              }}
              className="space-y-4 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Vacating Date <span className="text-red-400">*</span>
                  </label>
                  <input type="date" required
                    min={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    value={vacateForm.vacatingDate}
                    onChange={e => setVacateForm(f => ({ ...f, vacatingDate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum 30 days notice required</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Reason <span className="text-red-400">*</span>
                  </label>
                  <select required value={vacateForm.reason}
                    onChange={e => setVacateForm(f => ({ ...f, reason: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white">
                    <option value="">Select reason</option>
                    <option value="Course Completed">Course Completed</option>
                    <option value="Job Change / Relocation">Job Change / Relocation</option>
                    <option value="Personal Reasons">Personal Reasons</option>
                    <option value="Financial Reasons">Financial Reasons</option>
                    <option value="Found Other Accommodation">Found Other Accommodation</option>
                    <option value="Family Emergency">Family Emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Detailed Message <span className="text-red-400">*</span>
                </label>
                <textarea rows={4} required
                  placeholder="Please explain your reason for vacating in detail..."
                  value={vacateForm.message}
                  onChange={e => setVacateForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{vacateForm.message.length}/500 characters</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-base flex-shrink-0">⚠️</span>
                <div className="text-xs text-amber-700 space-y-1">
                  <p className="font-bold">Important Notice:</p>
                  <p>• 30 days notice period is mandatory as per PG rules</p>
                  <p>• Security deposit refunded after room inspection</p>
                  <p>• All dues must be cleared before vacating</p>
                  <p>• Room keys must be returned on vacating day</p>
                </div>
              </div>
              <button type="submit" disabled={vacateLoading}
                className="w-full py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
                {vacateLoading
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg> Sending...</>
                  : '📤 Submit Vacating Notice via WhatsApp'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Owner & Support — always last */}
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
                <p className="text-xs text-gray-400">Owner</p>
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

      </div>
    </div>
  )
}
