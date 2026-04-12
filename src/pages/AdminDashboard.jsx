import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { computeStats } from '../App'
import { roomsData } from '../data/roomsData'

const mockStudents = [
  { id: 1, name: 'Rahul Sharma',  room: 'R201', type: '2 Sharing', joining: '2026-04-01', status: 'Confirmed', phone: '9876543210' },
  { id: 2, name: 'Arjun Mehta',   room: 'R301', type: '3 Sharing', joining: '2026-04-10', status: 'Confirmed', phone: '9123456789' },
  { id: 3, name: 'Vikram Singh',  room: 'R101', type: '1 Sharing', joining: '2026-05-01', status: 'Pending',   phone: '9988776655' },
  { id: 4, name: 'Kiran Patil',   room: 'R401', type: '4 Sharing', joining: '2026-03-15', status: 'Confirmed', phone: '9765432100' },
  { id: 5, name: 'Sahil Desai',   room: 'R303', type: '3 Sharing', joining: '2026-05-10', status: 'Pending',   phone: '9654321098' },
]

const statusColor = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending:   'bg-yellow-100 text-yellow-700',
  Rejected:  'bg-red-100 text-red-600',
}

const roomTypes = ['1-sharing', '2-sharing', '3-sharing', '4-sharing']
const roomLabels = { '1-sharing': '1 Sharing', '2-sharing': '2 Sharing', '3-sharing': '3 Sharing', '4-sharing': '4 Sharing' }

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/', { replace: true }) }

  const totalStats = roomTypes.reduce((acc, key) => {
    const s = computeStats(roomsData[key])
    acc.totalBeds    += s.totalBeds
    acc.vacantBeds   += s.vacantBeds
    acc.occupiedBeds += s.occupiedBeds
    return acc
  }, { totalBeds: 0, vacantBeds: 0, occupiedBeds: 0 })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="sticky top-0 z-40 shadow-sm px-4 h-16 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            A
          </div>
          <div>
            <p className="font-extrabold text-gray-800 text-sm">{user.name}</p>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        <h1 className="text-2xl font-extrabold text-gray-800">Admin Overview</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: mockStudents.length,          color: 'text-blue-600',  bg: 'bg-blue-50',  icon: '🎓' },
            { label: 'Total Beds',     value: totalStats.totalBeds,          color: 'text-gray-800',  bg: 'bg-gray-50',  icon: '🛏️' },
            { label: 'Vacant Beds',    value: totalStats.vacantBeds,         color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
            { label: 'Occupied Beds',  value: totalStats.occupiedBeds,       color: 'text-red-500',   bg: 'bg-red-50',   icon: '🔴' },
          ].map(c => (
            <div key={c.label} className={`${c.bg} rounded-2xl p-5 flex flex-col gap-1`}>
              <span className="text-2xl">{c.icon}</span>
              <p className={`text-3xl font-extrabold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Room-wise vacancy */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-extrabold text-gray-800 text-base mb-4">🏠 Room-wise Vacancy</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {roomTypes.map(key => {
              const s = computeStats(roomsData[key])
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

        {/* Students table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-gray-800 text-base">🎓 All Students</h2>
            <span className="text-xs text-gray-400">{mockStudents.length} total</span>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Name', 'Room', 'Type', 'Joining', 'Phone', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-bold text-gray-400 pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockStudents.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 pr-4 font-semibold text-gray-800">{s.name}</td>
                    <td className="py-3 pr-4 text-gray-600">{s.room}</td>
                    <td className="py-3 pr-4 text-gray-600">{s.type}</td>
                    <td className="py-3 pr-4 text-gray-600">{s.joining}</td>
                    <td className="py-3 pr-4">
                      <a href={`tel:${s.phone}`} className="text-pink-600 hover:underline">{s.phone}</a>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {mockStudents.map(s => (
              <div key={s.id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-800">{s.name}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor[s.status]}`}>{s.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                  <span>🛏️ {s.room} · {s.type}</span>
                  <span>📅 {s.joining}</span>
                  <a href={`tel:${s.phone}`} className="text-pink-600 col-span-2">📞 {s.phone}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
