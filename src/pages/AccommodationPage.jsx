import { useEffect, useState } from 'react'
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

      {/* Live availability banner */}
      {hasData && (
        <div
          className="w-full px-4 sm:px-6 pt-6 pb-0"
          style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-white font-bold text-sm">
                  {totalVacant} Beds Available
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                out of {totalBeds} total · updates live
              </span>
            </div>
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