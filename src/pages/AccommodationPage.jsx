import { useEffect } from 'react'
import RoomTypesSection from '../components/RoomTypesSection'
import FooterSection from '../components/FooterSection'

export default function AccommodationPage({ rooms, onBook, onRoomUpdated }) {

  useEffect(() => {
    if (!rooms || Object.keys(rooms).length === 0) {
      onRoomUpdated?.()
    }
  }, [])

  // Compute total vacant beds from rooms map
  const totalVacant = Object.values(rooms || {}).reduce((sum, rt) => sum + (rt.vacantBeds || 0), 0)
  const totalBeds   = Object.values(rooms || {}).reduce((sum, rt) => sum + (rt.totalBeds   || 0), 0)
  const hasData     = totalBeds > 0

  return (
    <div className="min-h-screen flex flex-col">

      {/* Enhanced Live availability banner */}
      {hasData && (
        <div
          className="w-full px-4 sm:px-6 pt-6 pb-0"
          style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${
                  totalVacant <= 5 ? 'bg-red-500' : totalVacant <= 10 ? 'bg-orange-500' : 'bg-green-500'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-white font-bold text-sm">
                    {totalVacant} Beds Available
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  out of {totalBeds} total · updates live
                </span>
              </div>

              {/* Room-wise breakdown */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(rooms || {}).map(([slug, rt]) => (
                  <div key={slug} className="flex items-center gap-1 text-xs">
                    <span className="text-gray-500">{rt.tag}:</span>
                    <span className={`font-semibold ${rt.vacantBeds === 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {rt.vacantBeds === 0 ? 'Full' : `${rt.vacantBeds} left`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgency message for low availability */}
            {totalVacant <= 10 && (
              <div className={`${totalVacant <= 5 ? 'bg-red-500' : 'bg-orange-500'} text-white rounded-xl px-4 py-3 mb-4 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">
                    {totalVacant <= 5 
                      ? '🔥 HURRY UP! Only a few beds left - Newly opened PG booking fast!' 
                      : '⚡ Limited beds available - Secure your spot now!'
                    }
                  </p>
                  <div className="flex items-center gap-2 text-xs opacity-90">
                    <span>🏠 Newly Opened PG</span>
                    <span>•</span>
                    <span>📍 Prime Location</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div id="accommodation" className="flex-1">
        <RoomTypesSection
          onBook={onBook}
          roomsState={rooms}
          onRoomUpdated={onRoomUpdated} 
        />
      </div>

      <FooterSection />
    </div>
  )
}