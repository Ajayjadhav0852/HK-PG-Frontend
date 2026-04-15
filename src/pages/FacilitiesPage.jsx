import FacilitiesSection from '../components/FacilitiesSection'
import FooterSection from '../components/FooterSection'

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div id="facilities" className="flex-1 pt-16">
        <FacilitiesSection />
      </div>
      <FooterSection />
    </div>
  )
}