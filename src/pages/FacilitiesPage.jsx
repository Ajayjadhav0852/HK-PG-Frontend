import FacilitiesSection from '../components/FacilitiesSection'
import FooterSection from '../components/FooterSection'

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <FacilitiesSection />
      </div>
      <FooterSection />
    </div>
  )
}
