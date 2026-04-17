// Professional UPI Payment Gateway Screen - QR Code Only
export default function UPIPaymentScreen({ 
  amount, 
  upiId, 
  upiName, 
  selectedRoom, 
  onIPaid, 
  showToast 
}) {
  const upiLink = amount 
    ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('HK PG Security Deposit')}`
    : `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&cu=INR&tn=${encodeURIComponent('HK PG Security Deposit')}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}`

  const payApps = [
    {
      name: 'PhonePe',
      color: '#5f259f',
      // Official PhonePe logo SVG
      logo: (
        <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="12" fill="#5f259f"/>
          <text x="24" y="32" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Arial">Pe</text>
        </svg>
      ),
      link: amount
        ? `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('HK PG Deposit')}`
        : `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&cu=INR`,
    },
    {
      name: 'Google Pay',
      color: '#1a73e8',
      // Official Google Pay logo
      logo: (
        <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
          <text x="24" y="20" textAnchor="middle" fill="#4285F4" fontSize="9" fontWeight="bold" fontFamily="Arial">G</text>
          <text x="24" y="32" textAnchor="middle" fill="#34A853" fontSize="9" fontWeight="bold" fontFamily="Arial">Pay</text>
        </svg>
      ),
      link: amount
        ? `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('HK PG Deposit')}`
        : `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&cu=INR`,
    },
    {
      name: 'Paytm',
      color: '#00b9f1',
      // Official Paytm logo
      logo: (
        <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="12" fill="#00b9f1"/>
          <text x="24" y="30" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">Paytm</text>
        </svg>
      ),
      link: amount
        ? `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR`
        : `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&cu=INR`,
    },
  ]

  const handleAppPay = (app) => {
    window.location.href = app.link
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <div className="w-full max-w-lg">
        
        {/* Payment Gateway Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Header with gradient */}
          <div className="px-6 py-6 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-3 animate-pulse">
                <span className="text-4xl">🔒</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Secure Payment</h2>
              <p className="text-white/90 text-sm mt-1 font-medium">Complete your security deposit payment</p>
            </div>
          </div>

          {/* Booking Summary */}
          {selectedRoom && (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100">
                <p className="text-xs text-gray-500 font-semibold mb-1">Booking for:</p>
                <p className="font-bold text-gray-800 text-base">{selectedRoom.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">Monthly Rent:</span>
                  <span className="font-bold text-sm" style={{ color: '#c026d3' }}>
                    ₹{Number(selectedRoom.monthlyPrice || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {amount && (
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-pink-200">
                    <span className="text-xs text-gray-500">Deposit Amount:</span>
                    <span className="font-extrabold text-lg" style={{ color: '#c026d3' }}>
                      ₹{amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div className="px-6 py-5">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 text-center">Choose Payment Method</p>
            
            {/* UPI Apps Grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {payApps.map(app => (
                <button
                  key={app.name}
                  type="button"
                  onClick={() => handleAppPay(app)}
                  className="group relative flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border-2 border-gray-200 font-bold text-xs transition-all hover:border-pink-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 bg-white"
                >
                  <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
                    {app.logo}
                  </div>
                  <span className="text-gray-700 font-semibold text-xs">{app.name}</span>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${app.color}08, ${app.color}03)` }} />
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* UPI ID Section */}
            <div className="space-y-3 mb-5">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider text-center">Pay to UPI ID</p>
              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-3.5 border border-gray-200 shadow-sm">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">UPI ID</p>
                  <p className="font-mono font-bold text-gray-800 text-base">{upiId}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Payee: {upiName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(upiId)
                    showToast.success('Copied!', 'UPI ID copied to clipboard')
                  }}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl border border-gray-200 shadow-inner">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider text-center mb-4">
                Scan QR Code to Pay
              </p>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-3 bg-gradient-to-br from-pink-200 via-purple-200 to-pink-200 rounded-3xl blur-2xl opacity-40 animate-pulse" />
                  <div className="relative p-5 bg-white rounded-2xl border-2 border-gray-200 shadow-2xl">
                    <img
                      src={qrUrl}
                      alt="UPI QR Code"
                      className="w-48 h-48 block"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4 font-medium">
                Open any UPI app and scan to pay
              </p>
            </div>

            {/* Payment Instructions */}
            <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs font-bold text-blue-700 mb-2.5 flex items-center gap-2">
                <span className="text-base">ℹ️</span> How to Pay
              </p>
              <ol className="text-xs text-blue-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li className="font-medium">Tap any payment app button above OR scan QR code</li>
                <li className="font-medium">Complete payment{amount ? ` of ₹${amount.toLocaleString('en-IN')}` : ''} in the app</li>
                <li className="font-medium">Return to this page after payment</li>
                <li className="font-medium">Click <strong>"I Have Paid"</strong> button below</li>
              </ol>
            </div>
          </div>

          {/* Footer with action button */}
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <button
              type="button"
              onClick={onIPaid}
              className="w-full py-4 rounded-2xl font-extrabold text-white text-base shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-xl">✅</span>
                Payment Done →
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-3">
              Need help?{' '}
              <a href="tel:9579828996" className="text-pink-600 font-bold hover:underline">
                Call 9579828996
              </a>
            </p>
          </div>

        </div>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-5 mt-6 text-xs font-semibold text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="text-green-500">🔒</span> Secure
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-blue-500">✓</span> Verified
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-yellow-500">⚡</span> Instant
          </span>
        </div>

      </div>
    </div>
  )
}
