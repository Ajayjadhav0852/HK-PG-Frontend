import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showToast } from '../components/Toast'
import { rentApi } from '../services/api'
import UPIPaymentScreen from '../components/UPIPaymentScreen'

const UPI_ID   = '9579828996@ybl'
const UPI_NAME = 'Krishna Pandurang Pawar'

export default function PayRentPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Data passed from StudentDashboard via navigate state
  const { confirmedApp, monthlyRent, confirmedRoom } = location.state || {}

  // Guard — if accessed directly without state, redirect to dashboard
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

  const [step, setStep]               = useState('payment')   // 'payment' | 'screenshot' | 'done'
  const [screenshotFile, setScreenshotFile] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [month, setMonth]             = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [submitting, setSubmitting]   = useState(false)

  const monthLabel = (() => {
    const [y, m] = month.split('-')
    return new Date(y, m - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
  })()

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
      const fd = new FormData()
      fd.append('screenshot', screenshotFile)
      fd.append('studentName',  user?.name || '')
      fd.append('studentEmail', user?.email || '')
      fd.append('bedNumber',    confirmedApp?.bedNumber || '')
      fd.append('roomNumber',   confirmedApp?.roomNumber || '')
      fd.append('roomType',     confirmedApp?.roomTypeTitle || '')
      fd.append('amount',       monthlyRent || '')
      fd.append('month',        monthLabel)

      await rentApi.submitPayment(fd)
      showToast.update(toastId, 'success', '✅ Payment Submitted!', 'Admin has been notified. You will receive a confirmation email.')
      setStep('done')
    } catch (err) {
      showToast.update(toastId, 'error', 'Submission Failed', err.message || 'Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Step: Payment Done screen ─────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10"
        style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Payment Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your payment screenshot has been sent to admin. You will receive a confirmation email once admin verifies it.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-green-700 font-semibold mb-1">📋 Payment Summary</p>
            <p className="text-xs text-green-600">Month: <strong>{monthLabel}</strong></p>
            <p className="text-xs text-green-600">Amount: <strong>₹{Number(monthlyRent || 0).toLocaleString('en-IN')}</strong></p>
            <p className="text-xs text-green-600">Bed: <strong>{confirmedApp?.bedNumber}</strong></p>
          </div>
          <button
            onClick={() => navigate('/student')}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Step: Screenshot upload ───────────────────────────────────────────────
  if (step === 'screenshot') {
    return (
      <div className="min-h-screen px-4 py-8"
        style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>
        <div className="max-w-md mx-auto">

          <button onClick={() => setStep('payment')}
            className="mb-5 flex items-center gap-2 text-pink-600 font-semibold text-sm hover:text-pink-800 transition">
            ← Back to Payment
          </button>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 text-center"
              style={{ background: 'linear-gradient(135deg,#d63384,#c026d3)' }}>
              <span className="text-4xl">📸</span>
              <h2 className="text-xl font-extrabold text-white mt-2">Upload Payment Screenshot</h2>
              <p className="text-white/80 text-xs mt-1">Confirm your payment by uploading the screenshot</p>
            </div>

            <div className="p-6 space-y-5">

              {/* Month selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Month <span className="text-red-400">*</span>
                </label>
                <input
                  type="month"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {/* Payment summary */}
              <div className="bg-pink-50 border border-pink-100 rounded-xl p-4">
                <p className="text-xs font-bold text-pink-700 mb-2">💳 Payment Details</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>Month: <strong className="text-gray-800">{monthLabel}</strong></p>
                  <p>Amount: <strong className="text-pink-600">₹{Number(monthlyRent || 0).toLocaleString('en-IN')}</strong></p>
                  <p>Room: <strong className="text-gray-800">{confirmedApp?.roomTypeTitle} · {confirmedApp?.roomNumber}</strong></p>
                  <p>Bed: <strong className="text-gray-800">Bed {confirmedApp?.bedNumber}</strong></p>
                </div>
              </div>

              {/* Screenshot upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Screenshot <span className="text-red-400">*</span>
                </label>

                {screenshotPreview ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-green-300">
                    <img src={screenshotPreview} alt="Screenshot" className="w-full max-h-64 object-contain bg-gray-50" />
                    <button
                      onClick={() => { setScreenshotFile(null); setScreenshotPreview(null) }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition"
                    >×</button>
                    <div className="bg-green-50 px-3 py-2 text-xs text-green-700 font-semibold">
                      ✅ Screenshot selected: {screenshotFile?.name}
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 rounded-xl p-8 cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition">
                    <span className="text-4xl mb-3">📷</span>
                    <p className="text-sm font-semibold text-gray-700">Click to upload screenshot</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG supported</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              {/* Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-700">
                  <strong>📌 Note:</strong> Always pay rent through the application only. 
                  Admin will verify your screenshot and send a confirmation email.
                </p>
              </div>

              {/* Submit button */}
              <button
                onClick={handlePaymentDone}
                disabled={!screenshotFile || submitting}
                className="w-full py-4 rounded-2xl font-extrabold text-white text-base shadow-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: screenshotFile ? 'linear-gradient(135deg,#16a34a,#15803d)' : '#9ca3af' }}
              >
                {submitting
                  ? '⏳ Submitting...'
                  : screenshotFile
                    ? '✅ Payment Done — Notify Admin'
                    : '📷 Upload Screenshot First'
                }
              </button>

            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Step: UPI Payment ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>

      <div className="max-w-md mx-auto px-4 pt-6">
        <button onClick={() => navigate('/student')}
          className="mb-4 flex items-center gap-2 text-pink-600 font-semibold text-sm hover:text-pink-800 transition">
          ← Back to Dashboard
        </button>
      </div>

      <UPIPaymentScreen
        amount={monthlyRent}
        upiId={UPI_ID}
        upiName={UPI_NAME}
        selectedRoom={confirmedRoom ? {
          title: confirmedApp?.roomTypeTitle,
          monthlyPrice: monthlyRent,
        } : null}
        bedNumber={confirmedApp?.bedNumber}
        roomNumber={confirmedApp?.roomNumber}
        showToast={showToast}
        rentMode={true}
        onIPaid={() => setStep('screenshot')}
      />
    </div>
  )
}
