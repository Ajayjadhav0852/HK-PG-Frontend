import { useEffect } from 'react'
import RoomTypesSection from '../components/RoomTypesSection'
import FooterSection from '../components/FooterSection'

export default function AccommodationPage({ rooms, onBook, onRoomUpdated }) {

  // ✅ IMPORTANT: fetch when page loads
  useEffect(() => {
    if (!rooms || Object.keys(rooms).length === 0) {
      onRoomUpdated?.()
    }
  }, []) // run only once

  return (
    <div className="min-h-screen flex flex-col">

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