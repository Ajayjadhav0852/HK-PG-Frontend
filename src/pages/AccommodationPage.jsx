import RoomTypesSection from '../components/RoomTypesSection'
import FooterSection from '../components/FooterSection'

export default function AccommodationPage({ rooms, onBook }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <RoomTypesSection onBook={onBook} roomsState={rooms} />
      </div>
      <FooterSection />
    </div>
  )
}
