import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showToast } from '../components/Toast'
import { rentApi } from '../services/api'

const UPI_ID   = '9579828996@ybl'
const UPI_NAME = 'Krishna Pandurang Pawar'

export default function PayRentPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  const { confirmedApp, monthlyRent, confirmedRoom } = location.state || {}

  const [copied, setCopied]                   = useState(false)
  const [screenshotFile, setScreenshotFile]   = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [submitting, setSubmitting]           = useState(false)
  const [done, setDone]                       = useState(false)

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  const amtDisplay = monthlyRent
    ? `₹${Number(monthlyRent).toLocaleString('en-IN')}`
    : 'As agreed'

  const upiLink = monthlyRent
    ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${monthlyRent}&cu=INR&tn=${encodeURIComponent('HK PG Monthly Rent')}`
    : `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR&tn=${encodeURIComponent('HK PG Monthly Rent')}`

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}&bgcolor=ffffff&color=000000&margin=10`

  const payApps = [
    { name: 'PhonePe', color: '#5f259f',
      link: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${monthlyRent}&cu=INR` },
    { name: 'GPay',    color: '#4285F4',
      link: `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${monthlyRent}&cu=INR` },
    { name: 'Paytm',   color: '#002970',
      link: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${monthlyRent}&cu=INR` },
  ]

  const handleCopy = () => {
    navigator.clipboard?.writeText(UPI_ID).then(() => {
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

  const handlePaymentDone = async () => {
    if (!screenshotFile) {
      showToast.error('Screenshot Required', 'Please upload your payment screenshot first.')
      return
    }
    setSubmitting(true)
    const toastId = showToast.loading('Submitting...', 'Sending payment details to admin.')
    try {
      const now   = new Date()
      const month = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' })

      const fd = new FormData()
      fd.append('screenshot',   screenshotFile)
      fd.append('studentName',  user?.name  || '')
      fd.append('studentEmail', user?.email || '')
      fd.append('bedNumber',    String(confirmedApp?.bedNumber  || ''))
      fd.append('roomNumber',   String(confirmedApp?.roomNumber || ''))
      fd.append('roomType',     confirmedApp?.roomTypeTitle || '')
      fd.append('amount',       String(monthlyRent || ''))
      fd.append('month',        month)

      await rentApi.submitPayment(fd)
      showToast.update(toastId, 'success', '✅ Payment Submitted!', 'Admin has been notified.')
      setDone(true)
    } catch (err) {
      showToast.update(toastId, 'error', 'Submission Failed', err.message || 'Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Guard ─────────────────────────────────────────────────────────────────
  if (!confirmedApp) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-4">Please access Pay Rent from your dashboard.</p>
          <button onClick={() => navigate('/student')}
            className="px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}>
            ← Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Done screen ───────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
          <div className="text-6xl mb-5">🎉</div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-3">Payment Submitted!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            You will receive a confirmation email once admin verifies it.
          </p>
          <button
            onClick={() => navigate('/student')}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Main payment page ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-4 py-8"
      style={{ background: 'linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)' }}>
      <div className="max-w-md mx-auto">

        {/* Back */}
        <button onClick={() => navigate('/student')}
          className="mb-5 flex items-center gap-2 text-pink-600 font-semibold text-sm hover:text-pink-800 transition">
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Header */}
          <div className="px-6 py-5 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
            <div className="relative">
              <span className="text-4xl">🔒</span>
              <h2 className="text-xl font-extrabold text-white mt-2">Pay Monthly Rent</h2>
              <p className="text-white/80 text-xs mt-1">Pay securely via UPI and upload screenshot</p>
            </div>
          </div>

          <div className="px-5 py-5 space-y-4">

            {/* Amount card */}
            <div className="p-4 rounded-2xl border border-pink-100"
              style={{ background: 'linear-gradient(135deg,#fff0f6,#fdf3e7)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Monthly Rent</p>
                  <p className="text-3xl font-extrabold mt-0.5" style={{ color: '#c026d3' }}>{amtDisplay}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p className="font-semibold text-gray-700">{confirmedApp?.roomTypeTitle}</p>
                  <p>Room {confirmedApp?.roomNumber} · Bed {confirmedApp?.bedNumber}</p>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Secure UPI
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop hint */}
            {!isMobile && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-xl flex-shrink-0">📱</span>
                <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                  On desktop? Scan the QR code below with your phone to pay.
                </p>
              </div>
            )}

            {/* Mobile pay button */}
            {isMobile && (
              <a href={upiLink}
                className="block text-center py-4 rounded-2xl text-white font-extrabold text-base shadow-lg"
                style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}>
                🚀 Pay Now — Open UPI App
              </a>
            )}

            {/* App buttons mobile */}
            {isMobile && (
              <div className="grid grid-cols-3 gap-3">
                {payApps.map(app => (
                  <a key={app.name} href={app.link}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 border-gray-100 bg-white hover:border-pink-200 hover:shadow-md transition text-xs font-semibold text-gray-600">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: app.color }}>{app.name[0]}</span>
                    {app.name}
                  </a>
                ))}
              </div>
            )}

            {/* QR */}
            <div className="flex flex-col items-center py-2">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl blur-xl opacity-40" />
                <div className="relative p-4 bg-white rounded-2xl border-2 border-gray-200 shadow-xl">
                  <img src={qrUrl} alt="UPI QR Code" className="w-40 h-40 block"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center font-medium">
                Scan with any UPI app
              </p>
            </div>

            {/* UPI ID */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">UPI ID</p>
                <p className="font-mono font-bold text-gray-800 text-sm truncate">{UPI_ID}</p>
                <p className="text-xs text-gray-400 mt-0.5">{UPI_NAME}</p>
              </div>
              <button type="button" onClick={handleCopy}
                className="flex-shrink-0 px-3 py-2 rounded-lg font-bold text-xs text-white transition"
                style={{ background: copied ? '#16a34a' : 'linear-gradient(135deg,#d63384,#c026d3)' }}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>

            {/* Steps */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-blue-700 mb-2">📋 Steps:</p>
              <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
                <li>{isMobile ? 'Tap "Pay Now" or choose an app above' : 'Open PhonePe / GPay / Paytm and scan QR'}</li>
                <li>Complete payment of <strong>{amtDisplay}</strong></li>
                <li>Take a screenshot of the payment confirmation</li>
                <li>Upload screenshot below and click <strong>"Payment Done"</strong></li>
              </ol>
            </div>

            {/* ── Screenshot upload — inline on same page ── */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-bold text-gray-700 mb-3">
                📸 Upload Payment Screenshot <span className="text-red-400">*</span>
              </p>

              {screenshotPreview ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-green-300 mb-3">
                  <img src={screenshotPreview} alt="Screenshot preview"
                    className="w-full max-h-56 object-contain bg-gray-50" />
                  <button
                    onClick={() => { setScreenshotFile(null); setScreenshotPreview(null) }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition">
                    ×
                  </button>
                  <div className="bg-green-50 px-3 py-2 text-xs text-green-700 font-semibold">
                    ✅ {screenshotFile?.name}
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 rounded-xl p-6 cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition mb-3">
                  <span className="text-3xl mb-2">📷</span>
                  <p className="text-sm font-semibold text-gray-700">Click to upload screenshot</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG supported</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>

          </div>

          {/* Footer — Payment Done button only */}
          <div className="px-5 pb-5">
            <button
              type="button"
              onClick={handlePaymentDone}
              disabled={!screenshotFile || submitting}
              className="w-full py-4 rounded-2xl font-extrabold text-white text-base shadow-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: screenshotFile ? 'linear-gradient(135deg,#16a34a,#15803d)' : '#9ca3af' }}
            >
              {submitting ? '⏳ Submitting...' : '✅ Payment Done'}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Need help?{' '}
              <a href="tel:9579828996" className="text-pink-600 font-bold hover:underline">
                Call 9579828996
              </a>
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
