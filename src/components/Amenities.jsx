const amenities = [
  { icon: '📶', label: 'WiFi' },
  { icon: '🏍️', label: 'Two Wheeler Parking' },
  { icon: '👕', label: 'Laundry' },
  { icon: '📹', label: 'CCTV' },
  { icon: '🔋', label: 'Power Backup' },
  { icon: '🧹', label: 'Daily Housekeeping' },
  { icon: '❄️', label: 'AC Rooms' },
  { icon: '🏋️', label: 'Gym' },
  { icon: '🛗', label: 'Lift' },
]

export default function Amenities() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🧰 Amenities</h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {amenities.map((a) => (
          <div
            key={a.label}
            className="flex flex-col items-center gap-1 bg-blue-50 rounded-xl py-3 px-1"
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs text-gray-600 font-medium text-center">{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
