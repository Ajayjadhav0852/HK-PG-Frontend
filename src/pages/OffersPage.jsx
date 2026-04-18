import { useState } from 'react'
import FooterSection from '../components/FooterSection'

const CDAC_OFFERS = [
  {
    id: 'cdac-success',
    title: '🎯 CDAC Success Package',
    subtitle: 'Built by a CDAC student, for CDAC students',
    features: [
      '6 Month Flexible Stay Plan',
      'Placement Material Support',
      'Quiet Study Environment',
      'Group Stay Option (4-5 friends)',
      'Near IACSD CDAC Center',
      'Easy travel to KnowIT Deccan & IET Center',
      'Railway at doorstep & bus stand 50m away'
    ],
    highlight: 'Designed for Placement Success',
    bgGradient: 'from-blue-600 to-purple-600',
    icon: '🚀',
    badge: 'CDAC SPECIAL'
  },
  {
    id: 'cdac-group',
    title: '👥 CDAC Group Offer',
    subtitle: 'Come with 4-5 friends',
    features: [
      'Stay Together Guarantee',
      'Group Discount Available',
      'Same Room Allocation',
      'Shared Study Space',
      'Group Placement Support'
    ],
    highlight: 'Perfect for Study Groups',
    bgGradient: 'from-green-600 to-teal-600',
    icon: '👥',
    badge: 'GROUP SPECIAL'
  }
]

const DEGREE_OFFERS = [
  {
    id: 'annual-save',
    title: '🎉 Annual Saver Plan',
    subtitle: 'Stay 12 months, pay ONLY for 11',
    features: [
      'Save 1 month rent annually',
      'Fixed rent for full year',
      'Long-term stability',
      'Perfect for 1-4 year courses'
    ],
    highlight: 'Best Value for Long Stay',
    bgGradient: 'from-pink-600 to-rose-600',
    icon: '💰',
    badge: 'BEST VALUE'
  },
  {
    id: 'college-special',
    title: '🏫 College Student Special',
    subtitle: 'Perfect for DY Patil / PCCOE / PCET Students',
    features: [
      'Safe & Comfortable Living',
      'Long-term stay (1-4 years)',
      'Friendly Environment',
      'Study-focused atmosphere'
    ],
    highlight: 'Comfortable stay for your full college life',
    bgGradient: 'from-indigo-600 to-blue-600',
    icon: '🎓',
    badge: 'COLLEGE SPECIAL'
  },
  {
    id: 'refer-earn',
    title: '👥 Refer & Earn',
    subtitle: 'Earn ₹500 after 3 months',
    features: [
      'Refer friends to HK PG',
      'Earn ₹500 per successful referral',
      'Payment after 3 months of stay',
      'No limit on referrals'
    ],
    highlight: 'Share and Earn Together',
    bgGradient: 'from-orange-600 to-red-600',
    icon: '💸',
    badge: 'EARN MONEY'
  }
]

const SHORT_STAY_OFFERS = [
  {
    id: 'flexible-stay',
    title: '📅 Flexible Stay Options',
    subtitle: 'Perfect for short visits',
    features: [
      '1 Day / 1 Week / 15 Days stay',
      'Ideal for visitors & exams',
      'Near Railway Station',
      'No long-term commitment'
    ],
    highlight: 'Flexible booking for any duration',
    bgGradient: 'from-cyan-600 to-blue-600',
    icon: '⏰',
    badge: 'FLEXIBLE'
  }
]

function OfferCard({ offer, size = 'normal' }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const cardClasses = size === 'large' 
    ? 'col-span-full lg:col-span-2' 
    : 'col-span-1'

  return (
    <div className={`${cardClasses} group`}>
      <div className={`relative bg-gradient-to-br ${offer.bgGradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-white/10"></div>
        </div>

        {/* Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
            {offer.badge}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{offer.icon}</span>
            <div>
              <h3 className="font-bold text-lg">{offer.title}</h3>
              <p className="text-white/80 text-sm">{offer.subtitle}</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-4">
            {offer.features.slice(0, isExpanded ? offer.features.length : 3).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Expand/Collapse for mobile */}
          {offer.features.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/80 text-xs underline mb-3 lg:hidden"
            >
              {isExpanded ? 'Show Less' : `+${offer.features.length - 3} more`}
            </button>
          )}

          {/* Highlight */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="font-semibold text-sm">{offer.highlight}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title, subtitle, badge }) {
  return (
    <div className="text-center mb-8">
      <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
        {badge}
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
        {title}
      </h2>
      <p className="text-gray-500 text-sm max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  )
}

function CdacSpecialSection() {
  const [activeTab, setActiveTab] = useState('benefits')

  const benefits = [
    { icon: '🎯', title: 'Placement Focused', desc: 'Environment designed for CDAC success' },
    { icon: '📚', title: 'Study Material', desc: 'Placement & Pre-CAT material support' },
    { icon: '🤫', title: 'Silent Environment', desc: 'Guaranteed quiet study atmosphere' },
    { icon: '⚡', title: 'Time Saving', desc: 'Near CDAC centers - save travel time' },
    { icon: '👥', title: 'Group Options', desc: 'Stay with 4-5 friends together' },
    { icon: '📅', title: 'Flexible Stay', desc: '6-month plans, no long lock-in' }
  ]

  const testimonials = [
    {
      name: 'Rahul S.',
      course: 'CDAC IACSD',
      text: 'Perfect location and study environment. Got placed in Amdocs! Thanks to the owner - their CDAC placement material is top-notch and helped me in my placement journey.',
      rating: 5
    },
    {
      name: 'Sanket Patil',
      course: 'CDAC Deccan',
      text: 'Group stay option helped us study together. Highly recommend!',
      rating: 5
    }
  ]

  return (
    <div className="w-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-white/15 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white/10 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <span className="text-yellow-300">⭐</span>
            <span className="text-sm font-semibold">CDAC STUDENT SPECIAL</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Built by a <span className="text-yellow-300">CDAC student</span>,<br />
            for <span className="text-pink-300">CDAC students</span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            "Your 6 months matter – we support your placement journey"
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'benefits' 
                  ? 'bg-white text-purple-900 shadow-lg' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Benefits
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'testimonials' 
                  ? 'bg-white text-purple-900 shadow-lg' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Success Stories
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-white/80 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-300">⭐</span>
                  ))}
                </div>
                <p className="text-white/90 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.course}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Focus on Your Placement?</h3>
            <p className="text-white/80 mb-6">
              Join fellow CDAC students in an environment designed for success
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/accommodation'}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                🚀 Book Your CDAC Room
              </button>
              <button
                onClick={() => window.open('tel:+919876543210', '_self')}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl font-bold hover:bg-white/30 transition-all"
              >
                📞 Call for Group Booking
              </button>
            </div>

            <div className="mt-4 text-sm text-white/60">
              Limited beds available • Newly opened PG • Prime location
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function OffersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-purple-100 text-purple-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-4">
            SPECIAL OFFERS
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            🎁 Exclusive <span className="text-purple-600">Student Packages</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover special offers designed for CDAC students, degree students, and flexible stay options. 
            Save money and get the best value for your accommodation needs.
          </p>
        </div>
      </div>

      {/* CDAC Special Landing Section */}
      <CdacSpecialSection />

      {/* Main Offers Content */}
      <div className="w-full px-4 sm:px-6 py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          
          {/* CDAC Special Section */}
          <SectionHeader 
            title="🚀 CDAC Student Specials"
            subtitle="Your 6 months matter – we support your placement journey"
            badge="CDAC FOCUSED"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {CDAC_OFFERS.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Degree Student Section */}
          <SectionHeader 
            title="🎓 Student Offers"
            subtitle="Comfortable stay for your full college life"
            badge="LONG TERM"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {DEGREE_OFFERS.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Short Stay Section */}
          <SectionHeader 
            title="📅 Flexible Options"
            subtitle="Perfect for short visits and exam periods"
            badge="FLEXIBLE"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 max-w-2xl mx-auto mb-16">
            {SHORT_STAY_OFFERS.map(offer => (
              <OfferCard key={offer.id} offer={offer} size="large" />
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 border border-purple-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Book Your Room?
            </h3>
            <p className="text-gray-600 mb-6">
              Choose from our available room types and start your comfortable living experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/accommodation'}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
              >
                🏠 View Available Rooms
              </button>
              <button
                onClick={() => window.open('tel:+919876543210', '_self')}
                className="px-8 py-3 bg-white border-2 border-purple-300 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all"
              >
                📞 Call for Booking
              </button>
            </div>
          </div>

        </div>
      </div>

      <FooterSection />
    </div>
  )
}