import HeroSection from '../components/HeroSection'
import FooterSection from '../components/FooterSection'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection onBook={() => navigate('/accommodation')} />
      <div className="flex-1" />
      <FooterSection />
    </div>
  )
}
