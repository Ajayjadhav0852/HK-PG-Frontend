import RoomTypesSection from '../components/RoomTypesSection'
import FooterSection from '../components/FooterSection'

export default function AccommodationPage({ rooms, onBook, onRoomUpdated }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <RoomTypesSection onBook={onBook} roomsState={rooms} onRoomUpdated={onRoomUpdated} />
      </div>
      <FooterSection />
    </div>
  )
}
