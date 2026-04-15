import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../components/Toast'
import { adminApi, roomApi } from '../services/api'

const statusBadge = {
  CONFIRMED: 'bg-green-100 text-green-700 border border-green-200',
  PENDING:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  REJECTED:  'bg-red-100 text-red-600 border border-red-200',
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats]               = useState(null)
  const [applications, setApplications] = useState([])
  const [roomTypes, setRoomTypes]       = useState([])
  const [allRooms, setAllRooms]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [lastUpdated, setLastUpdated]   = useState(null)
  const pollRef = useRef(null)

  // ── Edit room type state ──────────────────────────────────────────────────
  const [editingRoom, setEditingRoom]   = useState(null) // slug being edited
  const [roomEditForm, setRoomEditForm] = useState({ monthlyPrice: '', securityDeposit: '', imageUrl: '', description: '' })
  const [roomSaving, setRoomSaving]     = useState(false)

  // ── Fetch all dashboard data ──────────────────────────────────────────────
  const fetchData = useCallback(async (silent = false) => {
    try {
      const [dashRes, appRes, roomRes, allRoomsRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getAllApplications(),
        roomApi.getAll(),
        roomApi.getAllRooms(),
      ])
      setStats(dashRes.data)
      setApplications(appRes.data || [])
      setRoomTypes(roomRes.data || [])
      setAllRooms(allRoomsRes.data || [])
      setLastUpdated(new Date())
    } catch (e) {
      if (!silent) showToast.error('Failed to Load', e.message || 'Could not fetch dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load + poll every 10s for live updates
  useEffect(() => {
    fetchData(false)
    pollRef.current = setInterval(() => fetchData(true), 10000)
    return () => clearInterval(pollRef.current)
  }, [fetchData])

  const handleLogout = () => {
    showToast.info('Logged Out', 'You have been signed out successfully.')
    setTimeout(() => { logout(); navigate('/', { replace: true }) }, 600)
  }

  const handleStatusChange = async (appId, status, applicantName) => {
    setActionLoading(appId)
    const toastId = showToast.loading('Updating...', `Processing ${applicantName}'s application.`)
    try {
      await adminApi.updateApplicationStatus(appId, status)
      await fetchData(true)
      if (status === 'CONFIRMED') {
        showToast.update(toastId, 'success', 'Application Confirmed ✅',
          `${applicantName}'s bed has been assigned. Vacancy updated.`)
      } else if (status === 'REJECTED') {
        showToast.update(toastId, 'error', 'Application Rejected',
          `${applicantName}'s application rejected. Bed freed.`)
      } else {
        showToast.update(toastId, 'info', 'Status Updated', `Changed to ${status}.`)
      }
    } catch (e) {
      showToast.update(toastId, 'error', 'Update Failed',
        e.message || 'Could not update status. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (appId, applicantName) => {
    if (!window.confirm(`Delete application from "${applicantName}"?\n\nThis will permanently remove the record and free the reserved bed.`)) return
    setActionLoading(appId)
    const toastId = showToast.loading('Deleting...', `Removing ${applicantName}'s application.`)
    try {
      await adminApi.deleteApplication(appId)
      await fetchData(true)
      showToast.update(toastId, 'success', 'Application Deleted 🗑️',
        `${applicantName}'s application has been permanently removed.`)
    } catch (e) {
      showToast.update(toastId, 'error', 'Delete Failed',
        e.message || 'Could not delete application. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  // ── Search + filter state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]   = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const openRoomEdit = (rt) => {
    setEditingRoom(rt.slug)
    setRoomEditForm({
      monthlyPrice:    String(rt.monthlyPrice),
      securityDeposit: String(rt.securityDeposit),
      imageUrl:        rt.imageUrl || '',
      description:     rt.description || '',
    })
  }

  const handleRoomSave = async (slug) => {
    setRoomSaving(true)
    const toastId = showToast.loading('Saving...', 'Updating room type details.')
    try {
      const payload = {}
      if (roomEditForm.monthlyPrice)    payload.monthlyPrice    = parseFloat(roomEditForm.monthlyPrice)
      if (roomEditForm.securityDeposit) payload.securityDeposit = parseFloat(roomEditForm.securityDeposit)
      if (roomEditForm.imageUrl.trim()) payload.imageUrl        = roomEditForm.imageUrl.trim()
      if (roomEditForm.description.trim()) payload.description  = roomEditForm.description.trim()

      await adminApi.updateRoomType(slug, payload)
      await fetchData(true)
      showToast.update(toastId, 'success', 'Room Updated ✅', 'Price and image saved successfully.')
      setEditingRoom(null)
    } catch (e) {
      showToast.update(toastId, 'error', 'Save Failed', e.message || 'Could not save changes.')
    } finally {
      setRoomSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
      <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm font-medium">Loading Admin Dashboard...</p>
    </div>
  )

  const totalBeds    = stats?.totalBeds    ?? 0
  const occupiedBeds = stats?.occupiedBeds ?? 0
  const vacantBeds   = stats?.vacantBeds   ?? 0
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="sticky top-0 z-40 shadow-sm px-4 h-16 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-extrabold text-gray-800 text-sm">{user?.name}</p>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-700">Live</span>
          </div>
          <button onClick={() => fetchData(false)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition">
            🔄 Refresh
          </button>
          <button onClick={() => navigate('/')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition">
            🏠 View Site
          </button>
          <button onClick={handleLogout}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-gray-800">Admin Overview</h1>
          {lastUpdated && (
            <p className="text-xs text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* ── Bed stats ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Students', value: stats?.totalStudents ?? 0,
              sub: null,
              color: 'text-blue-600',  bg: 'bg-blue-50',  icon: '🎓' },
            { label: 'Total Beds',      value: totalBeds,
              color: 'text-gray-800',  bg: 'bg-gray-50',  icon: '🛏️' },
            { label: 'Vacant Beds',     value: vacantBeds,
              color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
            { label: 'Occupied Beds',   value: occupiedBeds,
              color: 'text-red-500',   bg: 'bg-red-50',   icon: '🔴' },
          ].map(c => (
            <div key={c.label} className={`${c.bg} rounded-2xl p-5 flex flex-col gap-1 border border-gray-100`}>
              <span className="text-2xl">{c.icon}</span>
              <p className={`text-3xl font-extrabold transition-all duration-500 ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-500 font-medium">{c.label}</p>
              {c.sub && <p className="text-xs text-gray-400">{c.sub}</p>}
            </div>
          ))}
        </div>

        {/* ── Occupancy bar ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span>Overall Occupancy</span>
            <span>{occupancyPct}% ({occupiedBeds}/{totalBeds} beds)</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                occupancyPct >= 90 ? 'bg-red-500' :
                occupancyPct >= 60 ? 'bg-orange-400' :
                occupancyPct >= 30 ? 'bg-yellow-400' : 'bg-green-500'
              }`}
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 beds</span>
            <span>{totalBeds} beds total</span>
          </div>
        </div>

        {/* ── Application status counts ─────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending',   value: stats?.pendingApplications   ?? 0, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '⏳' },
            { label: 'Confirmed', value: stats?.confirmedApplications ?? 0, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  icon: '✅' },
            { label: 'Rejected',  value: stats?.rejectedApplications  ?? 0, color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-200',    icon: '❌' },
          ].map(c => (
            <div key={c.label} className={`${c.bg} border ${c.border} rounded-2xl p-4 text-center`}>
              <span className="text-xl">{c.icon}</span>
              <p className={`text-2xl font-extrabold mt-1 ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-500 font-medium">{c.label} Applications</p>
            </div>
          ))}
        </div>

        {/* ── Room Occupancy Map ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-gray-800 text-base">🗺️ Room & Bed Occupancy Map</h2>
            <span className="text-xs text-gray-400">Live — updates every 10s</span>
          </div>

          {['1st Floor', '2nd Floor'].map(floor => {
            const floorRooms = allRooms.filter(r => r.floor === floor)
            if (floorRooms.length === 0) return null
            return (
              <div key={floor} className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">🏢 {floor}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {floorRooms.map(r => {
                    const start = r.bedStart || 1
                    const beds  = Array.from({ length: r.bedsPerRoom }, (_, i) => ({
                      num:        start + i,
                      isOccupied: i < r.occupiedBeds,
                    }))
                    // Find who booked each bed
                    const confirmedApps = applications.filter(
                      a => a.roomNumber === r.roomNumber && a.status === 'CONFIRMED'
                    )
                    return (
                      <div key={r.id}
                        className={`rounded-2xl border p-4 ${r.full ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="font-extrabold text-gray-800 text-sm">{r.roomNumber}</span>
                            <span className="ml-2 text-xs text-gray-400">{r.roomTypeTitle}</span>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            r.full ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                          }`}>
                            {r.full ? '❌ Full' : `✅ ${r.vacantBeds} free`}
                          </span>
                        </div>

                        {/* Bed grid */}
                        <div className="flex gap-2 flex-wrap">
                          {beds.map(b => {
                            const bookedBy = confirmedApps.find(a => a.bedNumber === b.num)
                            return (
                              <div key={b.num}
                                title={bookedBy ? `Bed ${b.num} — ${bookedBy.fullName}` : `Bed ${b.num} — Vacant`}
                                className={`relative flex-1 min-w-[60px] h-14 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all cursor-default
                                  ${b.isOccupied
                                    ? 'bg-red-200 text-red-800 border border-red-300'
                                    : 'bg-green-200 text-green-800 border border-green-300'
                                  }`}>
                                <span className="text-base">{b.isOccupied ? '🔴' : '🟢'}</span>
                                <span>Bed {b.num}</span>
                                {bookedBy && (
                                  <span className="text-xs text-red-600 truncate max-w-full px-1" style={{ fontSize: '9px' }}>
                                    {bookedBy.fullName.split(' ')[0]}
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                          <span>🔴 Occupied: {r.occupiedBeds}</span>
                          <span>🟢 Vacant: {r.vacantBeds}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <p className="text-xs text-gray-400 mt-2">
            🟢 Green = Vacant &nbsp;|&nbsp; 🔴 Red = Occupied &nbsp;|&nbsp; Hover over a bed to see student name
          </p>
        </div>

        {/* ── Room Type Management ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-gray-800 text-base">🏠 Room Type Management</h2>
            <span className="text-xs text-gray-400">Admin only — click ✏️ to edit price or image</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roomTypes.map(rt => (
              <div key={rt.slug} className="border border-gray-100 rounded-2xl overflow-hidden">

                {/* Image with edit overlay */}
                <div className="relative h-36 bg-gray-100 group">
                  <img
                    src={rt.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80'}
                    alt={rt.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80' }}
                  />
                  {/* Edit image button overlay */}
                  <button
                    onClick={() => openRoomEdit(rt)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 text-white"
                  >
                    <span className="text-2xl">📷</span>
                    <span className="text-xs font-bold">Change Image</span>
                  </button>
                  <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-700">
                    {rt.tag}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3 space-y-2">
                  <p className="font-bold text-gray-800 text-sm">{rt.title}</p>

                  {/* Price row with edit button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Monthly Rent</p>
                      <p className="font-extrabold text-base" style={{ color: '#c026d3' }}>
                        ₹{Number(rt.monthlyPrice).toLocaleString('en-IN')}/mo
                      </p>
                    </div>
                    <button
                      onClick={() => openRoomEdit(rt)}
                      className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-lg transition"
                    >
                      ✏️ Edit
                    </button>
                  </div>

                  <div className="text-xs text-gray-500">
                    Deposit: ₹{Number(rt.securityDeposit).toLocaleString('en-IN')}
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
                    <span>🛏️ {rt.vacantBeds}/{rt.totalBeds} vacant</span>
                    <span>🏠 {rt.totalRooms} rooms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Edit Room Type Modal ──────────────────────────────────────────── */}
        {editingRoom && (() => {
          const rt = roomTypes.find(r => r.slug === editingRoom)
          if (!rt) return null
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5">

                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-gray-800 text-lg">✏️ Edit {rt.title}</h3>
                  <button onClick={() => setEditingRoom(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                {/* Current image preview */}
                <div className="relative rounded-2xl overflow-hidden h-40 bg-gray-100">
                  <img
                    src={roomEditForm.imageUrl || rt.imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80' }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                    Image Preview
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Image URL */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      📷 Image URL or Google Drive Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/FILE_ID/view or direct image URL"
                      value={roomEditForm.imageUrl}
                      onChange={e => setRoomEditForm(f => ({ ...f, imageUrl: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      💡 Paste a Google Drive share link — it will be auto-converted to a direct image URL.
                    </p>
                  </div>

                  {/* Monthly Price */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      💰 Monthly Rent (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 6000"
                      value={roomEditForm.monthlyPrice}
                      onChange={e => setRoomEditForm(f => ({ ...f, monthlyPrice: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  {/* Security Deposit */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      🔒 Security Deposit (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 8000"
                      value={roomEditForm.securityDeposit}
                      onChange={e => setRoomEditForm(f => ({ ...f, securityDeposit: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      📝 Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Short description of this room type..."
                      value={roomEditForm.description}
                      onChange={e => setRoomEditForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    disabled={roomSaving}
                    onClick={() => handleRoomSave(editingRoom)}
                    className="flex-1 py-3 rounded-xl font-extrabold text-white text-sm transition hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
                  >
                    {roomSaving ? '⏳ Saving...' : '✅ Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditingRoom(null)}
                    className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── Applications table ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <h2 className="font-extrabold text-gray-800 text-base">📋 All Applications</h2>
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {applications.length} total
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search name, email, mobile..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 w-48"
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-400 bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {(() => {
            const filtered = applications.filter(a => {
              const q = searchQuery.toLowerCase()
              const matchesSearch = !q ||
                a.fullName?.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q) ||
                a.mobile?.includes(q) ||
                a.roomNumber?.toLowerCase().includes(q)
              const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter
              return matchesSearch && matchesStatus
            })

            if (applications.length === 0) return (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">📭</p>
                <p className="font-semibold text-gray-500">No applications yet</p>
                <p className="text-xs mt-1">Applications will appear here once students apply.</p>
              </div>
            )

            if (filtered.length === 0) return (
              <div className="text-center py-10 text-gray-400">
                <p className="text-4xl mb-2">🔍</p>
                <p className="font-semibold text-gray-500">No results found</p>
                <p className="text-xs mt-1">Try a different search or filter.</p>
              </div>
            )

            return (
              <>
              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      {['#', 'Applicant', 'Room Type', 'Room', 'Bed No.', 'Joining', 'Mobile', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs font-bold text-gray-400 pb-3 pr-3 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((a, i) => (
                      <tr key={a.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-3.5 pr-3 text-xs text-gray-400 font-medium">{i + 1}</td>
                        <td className="py-3.5 pr-3">
                          <p className="font-bold text-gray-800">{a.fullName}</p>
                          <p className="text-xs text-gray-400">{a.email}</p>
                        </td>
                        <td className="py-3.5 pr-3 text-gray-600 text-xs font-medium">{a.roomTypeTitle}</td>
                        <td className="py-3.5 pr-3">
                          <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                            {a.roomNumber || '—'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-3">
                          {a.bedNumber ? (
                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                              Bed {a.bedNumber}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="py-3.5 pr-3 text-gray-600 text-xs">{a.joiningDate}</td>
                        <td className="py-3.5 pr-3">
                          <a href={`tel:${a.mobile}`} className="text-pink-600 hover:text-pink-800 font-semibold text-xs">
                            📞 {a.mobile}
                          </a>
                        </td>
                        <td className="py-3.5 pr-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge[a.status] || 'bg-gray-100 text-gray-600'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <div className="flex gap-1.5 flex-wrap items-center">
                            {a.status === 'PENDING' && (
                              <>
                                <button disabled={actionLoading === a.id}
                                  onClick={() => handleStatusChange(a.id, 'CONFIRMED', a.fullName)}
                                  className="text-xs px-2.5 py-1.5 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition disabled:opacity-50">
                                  {actionLoading === a.id ? '...' : '✓ Confirm'}
                                </button>
                                <button disabled={actionLoading === a.id}
                                  onClick={() => handleStatusChange(a.id, 'REJECTED', a.fullName)}
                                  className="text-xs px-2.5 py-1.5 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition disabled:opacity-50">
                                  ✗ Reject
                                </button>
                              </>
                            )}
                            {a.status === 'CONFIRMED' && (
                              <>
                                <span className="text-xs text-green-600 font-semibold">✅ Confirmed</span>
                                <button disabled={actionLoading === a.id}
                                  onClick={() => handleStatusChange(a.id, 'REJECTED', a.fullName)}
                                  className="text-xs px-2 py-1 bg-red-50 text-red-500 rounded-lg font-bold hover:bg-red-100 transition disabled:opacity-50">
                                  Reject
                                </button>
                              </>
                            )}
                            {a.status === 'REJECTED' && (
                              <>
                                <span className="text-xs text-red-500 font-semibold">❌ Rejected</span>
                                <button disabled={actionLoading === a.id}
                                  onClick={() => handleStatusChange(a.id, 'PENDING', a.fullName)}
                                  className="text-xs px-2 py-1 bg-yellow-50 text-yellow-600 rounded-lg font-bold hover:bg-yellow-100 transition disabled:opacity-50">
                                  Reopen
                                </button>
                              </>
                            )}
                            {/* Delete — always visible for all statuses */}
                            <button
                              disabled={actionLoading === a.id}
                              onClick={() => handleDelete(a.id, a.fullName)}
                              title="Delete application permanently"
                              className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-500 rounded-lg font-bold hover:bg-red-100 hover:text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="sm:hidden space-y-3">
                {filtered.map(a => (
                  <div key={a.id} className="border border-gray-100 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{a.fullName}</p>
                        <p className="text-xs text-gray-400">{a.email}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge[a.status] || 'bg-gray-100 text-gray-600'}`}>
                        {a.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <span>🛏️ {a.roomTypeTitle}</span>
                      <span>🏠 {a.roomNumber || '—'} {a.bedNumber ? `· Bed ${a.bedNumber}` : ''}</span>
                      <span>📅 {a.joiningDate}</span>
                      <a href={`tel:${a.mobile}`} className="text-pink-600 font-semibold">📞 {a.mobile}</a>
                    </div>
                    {a.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button disabled={actionLoading === a.id}
                          onClick={() => handleStatusChange(a.id, 'CONFIRMED', a.fullName)}
                          className="flex-1 text-xs py-2 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 disabled:opacity-50">
                          ✓ Confirm
                        </button>
                        <button disabled={actionLoading === a.id}
                          onClick={() => handleStatusChange(a.id, 'REJECTED', a.fullName)}
                          className="flex-1 text-xs py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 disabled:opacity-50">
                          ✗ Reject
                        </button>
                        <button disabled={actionLoading === a.id}
                          onClick={() => handleDelete(a.id, a.fullName)}
                          className="text-xs px-3 py-2 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-red-100 hover:text-red-600 disabled:opacity-50">
                          🗑️
                        </button>
                      </div>
                    )}
                    {a.status !== 'PENDING' && (
                      <div className="flex gap-2 pt-1">
                        {a.status === 'REJECTED' && (
                          <button disabled={actionLoading === a.id}
                            onClick={() => handleStatusChange(a.id, 'PENDING', a.fullName)}
                            className="flex-1 text-xs py-2 bg-yellow-50 text-yellow-600 rounded-xl font-bold hover:bg-yellow-100 disabled:opacity-50">
                            Reopen
                          </button>
                        )}
                        <button disabled={actionLoading === a.id}
                          onClick={() => handleDelete(a.id, a.fullName)}
                          className="flex-1 text-xs py-2 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-red-100 hover:text-red-600 disabled:opacity-50">
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
