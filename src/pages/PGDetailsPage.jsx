import HeroSection from '../components/HeroSection'
import FacilitiesSection from '../components/FacilitiesSection'
import RoomTypesSection from '../components/RoomTypesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import RulesPolicies from '../components/RulesPolicies'
import LocationInfo from '../components/LocationInfo'
import FooterSection from '../components/FooterSection'

export default function PGDetailsPage({ onBook, rooms }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section id="home">
        <HeroSection onBook={() => onBook('1-sharing')} />
      </section>

      <section id="facilities">
        <FacilitiesSection />
      </section>

      <section id="accommodation">
        <RoomTypesSection onBook={onBook} roomsState={rooms} />
      </section>

      <section id="testimonials">
        <TestimonialsSection />
      </section>

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-6 space-y-8">
        <RulesPolicies />
        <LocationInfo />
      </div>

      <section id="contact">
        <FooterSection />
      </section>
    </div>
  )
}
