import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { computeStats } from '../App'

const roomTypes  = ['1-sharing', '2-sharing', '3-sharing', '4-sharing']
const roomLabels = { '1-sharing': '1 Sharing', '2-sharing': '2 Sharing', '3-sharing': '3 Sharing', '4-sharing': '4 Sharing' }

export default function StudentDashboard({ rooms }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/', { replace: true }) }

  const totalStats = roomTypes.reduce((acc, key) => {
    const s = computeStats(rooms[key])
    acc.totalBeds    += s.totalBeds
    acc.vacantBeds   += s.vacantBeds
    acc.occupiedBeds += s.occupiedBeds
    return acc
  }, { totalBeds: 0, vacantBeds: 0, occupiedBeds: 0 })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar — same as admin */}
      <div className="sticky top-0 z-40 shadow-sm px-4 h-16 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-extrabold text-gray-800 text-sm">{user.name}</p>
            <p className="text-xs text-gray-400">Student Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

        <h1 className="text-2xl font-extrabold text-gray-800">
          Welcome, {user.name.split(' ')[0]} 👋
        </h1>

        {/* Summary cards — same layout as admin */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Beds',    value: totalStats.totalBeds,    color: 'text-gray-800',  bg: 'bg-gray-50',  icon: '🛏️' },
            { label: 'Vacant Beds',   value: totalStats.vacantBeds,   color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
            { label: 'Occupied Beds', value: totalStats.occupiedBeds, color: 'text-red-500',   bg: 'bg-red-50',   icon: '🔴' },
          ].map(c => (
            <div key={c.label} className={`${c.bg} rounded-2xl p-5 flex flex-col gap-1`}>
              <span className="text-2xl">{c.icon}</span>
              <p className={`text-3xl font-extrabold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Room-wise vacancy — identical to admin */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-extrabold text-gray-800 text-base mb-4">🏠 Room-wise Vacancy</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {roomTypes.map(key => {
              const s = computeStats(rooms[key])
              return (
                <button
                  key={key}
                  onClick={() => navigate(`/room/${key}`)}
                  className="border border-gray-100 rounded-xl p-4 text-left hover:shadow-md transition group"
                >
                  <p className="font-bold text-gray-700 text-sm group-hover:text-pink-600 transition">{roomLabels[key]}</p>
                  <p className="text-2xl font-extrabold text-green-600 mt-1">{s.vacantBeds}</p>
                  <p className="text-xs text-gray-400">of {s.totalBeds} beds vacant</p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all"
                      style={{ width: `${(s.occupiedBeds / s.totalBeds) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{Math.round((s.occupiedBeds / s.totalBeds) * 100)}% occupied</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Contact Owner & Support */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
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
