import { useState, useEffect } from 'react'

export default function AvailabilityBanner({ rooms, totalVacant, totalBeds, hasData }) {
  const [urgencyLevel, setUrgencyLevel] = useState('normal')
  const [showUrgency, setShowUrgency] = useState(false)

  useEffect(() => {
    if (!hasData || totalBeds === 0) return

    const occupancyRate = ((totalBeds - totalVacant) / totalBeds) * 100
    
    if (occupancyRate >= 90) {
      setUrgencyLevel('critical')
    } else if (occupancyRate >= 75) {
      setUrgencyLevel('high')
    } else if (occupancyRate >= 50) {
      setUrgencyLevel('medium')
    } else {
      setUrgencyLevel('normal')
    }

    // Show urgency message for high occupancy
    setShowUrgency(occupancyRate >= 75)
  }, [totalVacant, totalBeds, hasData])

  const getUrgencyConfig = () => {
    switch (urgencyLevel) {
      case 'critical':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          message: '🔥 HURRY UP! Only few beds left - Newly opened PG booking fast!',
          pulseColor: 'bg-red-300'
        }
      case 'high':
        return {
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          message: '⚡ Limited beds available - Secure your spot now!',
          pulseColor: 'bg-orange-300'
        }
      case 'medium':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-white',
          message: '⏰ Booking fast - Reserve your room today!',
          pulseColor: 'bg-yellow-300'
        }
      default:
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          message: '✅ Good availability - Multiple options available',
          pulseColor: 'bg-green-300'
        }
    }
  }

  if (!hasData) return null

  const config = getUrgencyConfig()

  return (
    <div className="w-full px-4 sm:px-6 pt-6 pb-0" style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      <div className="max-w-5xl mx-auto">
        
        {/* Main availability banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor} shadow-sm`}>
              <span className={`w-2 h-2 rounded-full ${config.pulseColor} animate-pulse`} />
              <span className={`${config.textColor} font-bold text-sm`}>
                {totalVacant} Beds Available
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              out of {totalBeds} total · updates live
            </span>
          </div>

          {/* Room-wise breakdown */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(rooms || {}).map(([slug, rt]) => (
              <div key={slug} className="flex items-center gap-1 text-xs">
                <span className="text-gray-500">{rt.tag}:</span>
                <span className={`font-semibold ${rt.vacantBeds === 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {rt.vacantBeds === 0 ? 'Full' : `${rt.vacantBeds} left`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency message */}
        {showUrgency && (
          <div className={`${config.bgColor} ${config.textColor} rounded-xl px-4 py-3 mb-4 shadow-lg`}>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">
                {config.message}
              </p>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <span>🏠 Newly Opened PG</span>
                <span>•</span>
                <span>📍 Prime Location</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{totalBeds - totalVacant}</div>
            <div className="text-xs text-gray-500">Students Living</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{totalVacant}</div>
            <div className="text-xs text-gray-500">Available Now</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">4</div>
            <div className="text-xs text-gray-500">Room Types</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-pink-600">100%</div>
            <div className="text-xs text-gray-500">Occupancy Target</div>
          </div>
        </div>

      </div>
    </div>
  )
}