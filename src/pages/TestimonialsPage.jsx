import TestimonialsSection from '../components/TestimonialsSection'
import FooterSection from '../components/FooterSection'

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <TestimonialsSection />
      </div>
      <FooterSection />
    </div>
  )
}
