import FacilitiesSection from '../components/FacilitiesSection'
import FooterSection from '../components/FooterSection'

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ✅ FACILITIES SECTION (IMPORTANT) */}
      <div id="facilities" className="flex-1">
        <FacilitiesSection />
      </div>

      <FooterSection />
    </div>
  )
}