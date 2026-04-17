// Professional Booking Success / Confirmation Screen
export default function BookingSuccessScreen({ selectedRoom, onAfterSubmit, advanceAmount }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' }}>
      <div className="w-full max-w-lg">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100">
          
          {/* Animated Success Header */}
          <div className="px-6 py-8 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <span className="text-6xl animate-bounce">✅</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-1">Booking Received!</h2>
              <p className="text-white/90 text-base font-medium">Thanks for choosing us 🙏</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">

            {/* Pending Verification Banner */}
            <div className="p-5 rounded-2xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-2xl">
                  ⏳
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-yellow-800 text-base mb-1">Pending Verification</p>
                  <p className="text-yellow-700 text-sm leading-relaxed">
                    Your booking will be <strong>confirmed after payment verification</strong> by our team.
                    We'll contact you within <strong>24 hours</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            {selectedRoom && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Your Booking Summary</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-gray-800 text-lg">{selectedRoom.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">HK PG Akurdi, Pune</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-2xl" style={{ color: '#c026d3' }}>
                      ₹{Number(selectedRoom.monthlyPrice || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-400">per month</p>
                  </div>
                </div>
                {advanceAmount && (
                  <div className="mt-3 pt-3 border-t border-pink-200 flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Advance Paid</span>
                    <span className="font-bold text-green-600">₹{advanceAmount.toLocaleString('en-IN')} ✓</span>
                  </div>
                )}
              </div>
            )}

            {/* What's Next Timeline */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>📋</span> What Happens Next
              </p>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-pink-300 to-green-300" />
                <div className="space-y-4">
                  {[
                    { icon: '🔍', text: 'Our team verifies your payment', time: 'Within 2-4 hours', color: '#d63384' },
                    { icon: '✅', text: 'Your bed is confirmed & reserved', time: 'Same day', color: '#c026d3' },
                    { icon: '📞', text: 'You receive confirmation call/WhatsApp', time: 'Within 24 hours', color: '#9333ea' },
                    { icon: '🏠', text: 'Visit us on joining date with documents', time: 'As per your date', color: '#16a34a' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center flex-shrink-0 shadow-sm z-10"
                        style={{ borderColor: step.color }}>
                        <span className="text-lg">{step.icon}</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-semibold text-gray-700">{step.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 text-center">
                Contact Us
              </p>
              <div className="grid grid-cols-3 gap-2">
                <a href="tel:9579828996"
                  className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-sm border-2 border-pink-100 bg-gradient-to-br from-pink-50 to-white"
                  style={{ color: '#c026d3' }}>
                  <span className="text-2xl">📞</span>
                  <span>Call Owner</span>
                </a>
                <a href="tel:9096398032"
                  className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-sm border-2 border-pink-100 bg-gradient-to-br from-pink-50 to-white"
                  style={{ color: '#c026d3' }}>
                  <span className="text-2xl">📱</span>
                  <span>Call Team</span>
                </a>
                <a href={`https://wa.me/919579828996?text=${encodeURIComponent('Hi! I just paid the advance for HK PG booking. Please confirm my booking.')}`}
                  target="_blank" rel="noreferrer"
                  className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-sm border-2 border-green-100 bg-gradient-to-br from-green-50 to-white text-green-600">
                  <span className="text-2xl">💬</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <button
              onClick={onAfterSubmit}
              className="w-full py-3 rounded-xl font-bold text-sm text-gray-600 hover:text-pink-600 hover:bg-white transition-all border border-gray-200 hover:border-pink-200 hover:shadow-md"
            >
              View Room Status →
            </button>
          </div>

        </div>

        {/* Thank You Message */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-gray-600 italic">
            "Have a nice day! We look forward to welcoming you at HK PG 🏠"
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs font-semibold text-gray-400">
            <span className="flex items-center gap-1.5"><span className="text-green-500">🔒</span> Secure</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><span className="text-blue-500">✓</span> Verified</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><span className="text-yellow-500">⚡</span> Instant</span>
          </div>
        </div>

      </div>
    </div>
  )
}
