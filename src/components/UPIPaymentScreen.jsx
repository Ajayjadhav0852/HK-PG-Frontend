import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { rentApi } from '../services/api'

export default function UPIPaymentScreen({
  amount,
  upiId,
  upiName,
  selectedRoom,
  bedNumber,
  roomNumber,
  onIPaid,
  showToast,
  rentMode = false
}) {
  const { user } = useAuth()
  const [copied, setCopied]               = useState(false)
  const [screenshotFile, setScreenshotFile] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [submitting, setSubmitting]       = useState(false)
  const [month, setMonth]                 = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const fileInputRef = useRef(null)

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  const upiLink = amount
    ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(rentMode ? 'HK PG Monthly Rent' : 'HK PG Security Deposit')}`
    : `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&cu=INR`

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}&bgcolor=ffffff&color=000000&margin=10`

  const payApps = [
    {
      name: 'PhonePe',
      link: `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}${amount ? `&am=${amount}` : ''}&cu=INR`,
      logo: (
        <svg viewBox="0 0 50 50" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <rect width="50" height="50" rx="12" fill="#5f259f"/>
          <text x="25" y="33" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial,sans-serif">Pe</text>
        </svg>
      ),
    },
    {
      name: 'Google Pay',
      link: `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}${amount ? `&am=${amount}` : ''}&cu=INR`,
      logo: (
        <svg viewBox="0 0 50 50" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <rect width="50" height="50" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
          <text x="25" y="22" textAnchor="middle" fill="#4285F4" fontSize="12" fontWeight="900" fontFamily="Arial,sans-serif">G</text>
          <text x="25" y="36" textAnchor="middle" fill="#34A853" fontSize="10" fontWeight="700" fontFamily="Arial,sans-serif">Pay</text>
        </svg>
      ),
    },
    {
      name: 'Paytm',
      link: `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}${amount ? `&am=${amount}` : ''}&cu=INR`,
      logo: (
        <svg viewBox="0 0 50 50" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <rect width="50" height="50" rx="12" fill="#002970"/>
          <text x="25" y="24" textAnchor="middle" fill="#00b9f1" fontSize="10" fontWeight="900" fontFamily="Arial,sans-serif">Pay</text>
          <text x="25" y="37" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="Arial,sans-serif">tm</text>
        </svg>
      ),
    },
  ]

  const handleAppClick = (app) => {
    if (isMobile) {
      window.location.href = app.link
    } else {
      showToast?.info('Use Mobile', 'Please scan the QR code with your phone to pay.')
    }
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(upiId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setScreenshotFile(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }

  const monthLabel = (() => {
    const [y, m] = month.split('-')
    return new Date(y, m - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
  })()

  const handlePaid = async () => {
    if (rentMode && !screenshotFile) {
      showToast?.error('Screenshot Required', 'Please upload your payment screenshot first.')
      return
    }

    setSubmitting(true)
    const toastId = showToast?.loading('Submitting...', 'Sending payment details to admin.')

    try {
      if (rentMode) {
        const fd = new FormData()
        fd.append('screenshot',   screenshotFile)
        fd.append('studentName',  user?.name  || '')
        fd.append('studentEmail', user?.email || '')
        fd.append('bedNumber',    bedNumber   || '')
        fd.append('roomNumber',   roomNumber  || '')
        fd.append('roomType',     selectedRoom?.title || '')
        fd.append('amount',       amount ? String(amount) : '')
        fd.append('month',        monthLabel)
        await rentApi.submitPayment(fd)
        showToast?.update(toastId, 'success', '✅ Payment Submitted!', 'Admin has been notified. You will receive a confirmation email.')
      }
      onIPaid?.()
    } catch (err) {
      showToast?.update(toastId, 'error', 'Submission Failed', err.message || 'Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const amtDisplay = amount ? `₹${Number(amount).toLocaleString('en-IN')}` : 'As agreed'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Header */}
          <div className="px-6 py-5 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
            <div className="relative">
              <span className="text-4xl">🔒</span>
              <h2 className="text-xl font-extrabold text-white mt-2">
                {rentMode ? 'Pay Monthly Rent' : 'Secure Payment'}
              </h2>
              <p className="text-white/90 text-sm mt-1 font-semibold">
                {rentMode ? 'Pay securely via UPI & upload screenshot' : 'Send your payment screenshot to confirm booking'}
              </p>
            </div>
          </div>

          <div className="px-5 py-5 space-y-4">

            {/* Amount + Room */}
            <div className="p-4 rounded-2xl border border-pink-100"
              style={{ background: 'linear-gradient(135deg, #fff0f6, #fdf3e7)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">
                    {rentMode ? 'Monthly Rent' : 'Security Deposit'}
                  </p>
                  <p className="text-3xl font-extrabold mt-0.5" style={{ color: '#c026d3' }}>
                    {amtDisplay}
                  </p>
                  {rentMode && bedNumber && (
                    <p className="text-xs text-gray-500 mt-1">Bed {bedNumber} · Room {roomNumber}</p>
                  )}
                </div>
                <div className="text-right">
                  {selectedRoom && (
                    <p className="text-xs text-gray-500">{selectedRoom.title}</p>
                  )}
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Secure UPI
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop warning */}
            {!isMobile && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-xl flex-shrink-0">📱</span>
                <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                  You're on a desktop. Please <strong>scan the QR code</strong> below using your phone to pay.
                </p>
              </div>
            )}

            {/* Mobile: Pay Now button */}
            {isMobile && (
              <a href={upiLink}
                className="block text-center py-4 rounded-2xl text-white font-extrabold text-base shadow-lg transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
                🚀 Pay Now — Open UPI App
              </a>
            )}

            {/* App buttons — mobile only */}
            {isMobile && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-3">Or choose app</p>
                <div className="grid grid-cols-3 gap-3">
                  {payApps.map(app => (
                    <button key={app.name} type="button" onClick={() => handleAppClick(app)}
                      className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 border-gray-100 bg-white transition-all hover:border-pink-200 hover:shadow-lg active:scale-95">
                      {app.logo}
                      <span className="text-xs font-semibold text-gray-600">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {isMobile ? 'Or scan QR' : 'Scan QR to pay'}
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center py-2">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl blur-xl opacity-40" />
                <div className="relative p-4 bg-white rounded-2xl border-2 border-gray-200 shadow-xl">
                  <img src={qrUrl} alt="UPI QR Code" className="w-44 h-44 block"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center font-medium">
                {isMobile ? 'Scan with any UPI app' : 'Scan with your phone camera or UPI app'}
              </p>
            </div>

            {/* UPI ID */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">UPI ID</p>
                <p className="font-mono font-bold text-gray-800 text-sm truncate">{upiId}</p>
                <p className="text-xs text-gray-400 mt-0.5">{upiName}</p>
              </div>
              <button type="button" onClick={handleCopy}
                className="flex-shrink-0 px-3 py-2 rounded-lg font-bold text-xs text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: copied ? '#16a34a' : 'linear-gradient(135deg, #d63384, #c026d3)' }}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>

            {/* Steps */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-blue-700 mb-2">📋 Steps:</p>
              <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
                <li>{isMobile ? 'Tap "Pay Now" or choose an app above' : 'Open PhonePe / GPay / Paytm on your phone'}</li>
                {!isMobile && <li>Scan the QR code above</li>}
                <li>Complete payment of <strong>{amtDisplay}</strong></li>
                <li>Upload your payment screenshot below</li>
                <li>Click <strong>"Payment Done ✅"</strong></li>
              </ol>
            </div>

            {/* ── Screenshot Upload (rent mode) ─────────────────────────── */}
            {rentMode && (
              <div className="space-y-3">
                {/* Month selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Payment Month <span className="text-red-400">*</span>
                  </label>
                  <input type="month" value={month} onChange={e => setMonth(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100" />
                </div>

                {/* Upload field */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Upload Payment Screenshot <span className="text-red-400">*</span>
                  </label>

                  {/* Preview */}
                  {screenshotPreview ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-green-300">
                      <img src={screenshotPreview} alt="Payment screenshot"
                        className="w-full max-h-52 object-contain bg-gray-50" />
                      <button onClick={() => { setScreenshotFile(null); setScreenshotPreview(null) }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition shadow">
                        ×
                      </button>
                      <div className="bg-green-50 px-3 py-1.5 flex items-center gap-2">
                        <span className="text-green-600 text-xs">✅</span>
                        <span className="text-xs text-green-700 font-semibold truncate">{screenshotFile?.name}</span>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 rounded-xl p-6 cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition">
                      <span className="text-3xl mb-2">📷</span>
                      <p className="text-sm font-semibold text-gray-700">Click to upload screenshot</p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG supported</p>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Footer — Payment Done button only */}
          <div className="px-5 pb-5">
            <button
              type="button"
              onClick={handlePaid}
              disabled={submitting || (rentMode && !screenshotFile)}
              className="w-full py-4 rounded-2xl font-extrabold text-white text-base shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{ background: (rentMode && !screenshotFile) ? '#9ca3af' : 'linear-gradient(135deg, #16a34a, #15803d)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-xl">✅</span>
                {submitting ? 'Submitting...' : rentMode && !screenshotFile ? 'Upload Screenshot First' : 'Payment Done !'}
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Need help?{' '}
              <a href="tel:9579828996" className="text-pink-600 font-bold hover:underline">Call 9579828996</a>
            </p>
          </div>

        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 mt-5 text-xs font-semibold text-gray-400">
          <span className="flex items-center gap-1.5"><span className="text-green-500">🔒</span> Secure</span>
          <span className="flex items-center gap-1.5"><span className="text-blue-500">✓</span> Verified</span>
          <span className="flex items-center gap-1.5"><span className="text-yellow-500">⚡</span> Instant</span>
        </div>

      </div>
    </div>
  )
}
