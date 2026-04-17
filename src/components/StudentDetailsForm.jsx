import { useState, useEffect } from 'react'
import { showToast } from '../components/Toast'
import { applicationApi, roomApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

// ── UPI Config — change these to owner's actual UPI details ──────────────────
const UPI_ID       = 'hkpgakurdi@upi'          // ← Replace with actual UPI ID
const UPI_NAME     = 'HK PG Akurdi'
const ADVANCE_AMT  = 500                         // ₹500 advance booking amount
// QR code generated via UPI deep link using a free QR API
const UPI_DEEP_LINK = (amount) =>
  `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('HK PG Advance Booking')}`
const QR_URL = (amount) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(UPI_DEEP_LINK(amount))}`

const inputCls  = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition bg-white'
const selectCls = inputCls
const errCls    = 'border-red-400 focus:border-red-400 focus:ring-red-100'

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
    <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2">{title}</h3>
    {children}
  </div>
)

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

// ── Export to Excel (admin only) ──────────────────────────────────────────────
function exportToExcel(formData, selectedRoom, allRooms) {
  const room = allRooms.find(r => r.roomNumber === formData.preferredRoomNumber)
  const bedEnd = room ? room.bedStart + room.bedsPerRoom - 1 : ''
  const bedRange = room
    ? (room.bedsPerRoom === 1 ? `Bed ${room.bedStart}` : `Beds ${room.bedStart}–${bedEnd}`)
    : ''

  const rows = [
    ['Field', 'Value'],
    ['Full Name',          formData.fullName],
    ['Mobile',             formData.mobile],
    ['Alternate Mobile',   formData.alternateMobile || ''],
    ['Email',              formData.email],
    ['Address',            formData.address],
    ['City',               formData.city],
    ['State',              formData.state],
    ['Occupation',         formData.occupation],
    ['Institution',        formData.institutionName],
    ['Course / Role',      formData.courseOrRole],
    ['Guardian Name',      formData.guardianName],
    ['Guardian Contact',   formData.guardianContact],
    ['Guardian Relation',  formData.guardianRelation],
    ['Joining Date',       formData.joiningDate],
    ['Duration (months)',  formData.durationMonths],
    ['Room Type',          selectedRoom?.title || ''],
    ['Selected Room',      formData.preferredRoomNumber || ''],
    ['Floor',              room?.floor || ''],
    ['Bed Numbers',        bedRange],
    ['Deposit Amount',     formData.depositAmount || ''],
    ['Payment Mode',       formData.paymentMode || ''],
    ['Transaction ID',     formData.transactionId || ''],
    ['ID Proof Type',      formData.idProofType || ''],
  ]

  // Build CSV content
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `HK_PG_Application_${formData.fullName.replace(/\s+/g, '_') || 'form'}_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const INIT = {
  fullName: '', mobile: '', alternateMobile: '', email: '',
  address: '', city: '', state: '',
  occupation: '', institutionName: '', courseOrRole: '',
  guardianName: '', guardianContact: '', guardianRelation: '',
  joiningDate: '', durationMonths: '',
  depositAmount: '', paymentMode: '', transactionId: '',
  idProofType: '',
  preferredRoomNumber: '',
  selectedBedNumber: '',   // bed number within the selected room
}

export default function StudentDetailsForm({ selectedRoom, onSubmit, onAfterSubmit }) {
  const { user }                      = useAuth()
  const isAdmin                       = user?.role === 'admin'

  const [agreed, setAgreed]           = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [showUPI, setShowUPI]         = useState(false)   // UPI payment screen
  const [upiConfirmed, setUpiConfirmed] = useState(false) // user clicked "I Paid"
  const [savedAppId, setSavedAppId]   = useState(null)    // saved application ID
  const [loading, setLoading]         = useState(false)
  const [formData, setFormData]       = useState(INIT)
  const [fieldErrors, setFieldErrors] = useState({})
  const [idProofFile, setIdProofFile] = useState(null)
  const [photoFile, setPhotoFile]     = useState(null)

  // All rooms from API
  const [allRooms, setAllRooms]         = useState([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  // Booked beds for selected room (PENDING + CONFIRMED) — prevents double booking
  const [bookedBeds, setBookedBeds]     = useState([])

  useEffect(() => {
    roomApi.getAllRooms()
      .then(res => setAllRooms(res.data || []))
      .catch(() => setAllRooms([]))
      .finally(() => setRoomsLoading(false))
  }, [])

  // Fetch booked beds whenever room selection changes
  useEffect(() => {
    if (!formData.preferredRoomNumber) { setBookedBeds([]); return }
    roomApi.getBookedBeds(formData.preferredRoomNumber)
      .then(res => setBookedBeds(res.data || []))
      .catch(() => setBookedBeds([]))
  }, [formData.preferredRoomNumber])

  const set = (key) => (e) => {
    setFormData(f => ({ ...f, [key]: e.target.value }))
    if (fieldErrors[key]) setFieldErrors(fe => ({ ...fe, [key]: '' }))
  }

  // ── KEY FIX: only show rooms matching the selected room type ─────────────
  // If student came from "1-sharing Book Now" → only show 1-sharing rooms
  // If student came from "3-sharing Book Now" → only show 3-sharing rooms
  const typeFilteredRooms = selectedRoom?.slug
    ? allRooms.filter(r => r.roomTypeSlug === selectedRoom.slug)
    : allRooms

  // Further filter to only vacant rooms
  const vacantRooms = typeFilteredRooms.filter(r => !r.full)

  const validate = () => {
    const errs = {}
    if (!formData.fullName.trim())                                        errs.fullName         = 'Full name is required'
    if (!/^[0-9]{10}$/.test(formData.mobile))                            errs.mobile           = 'Enter a valid 10-digit mobile number'
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email            = 'Enter a valid email address'
    if (!formData.address.trim())                                         errs.address          = 'Address is required'
    if (!formData.city.trim())                                            errs.city             = 'City is required'
    if (!formData.state.trim())                                           errs.state            = 'State is required'
    if (!formData.occupation)                                             errs.occupation       = 'Occupation is required'
    if (!formData.institutionName.trim())                                 errs.institutionName  = 'College/Company name is required'
    if (!formData.courseOrRole.trim())                                    errs.courseOrRole     = 'Course/Job role is required'
    if (!formData.guardianName.trim())                                    errs.guardianName     = 'Guardian name is required'
    if (!/^[0-9]{10}$/.test(formData.guardianContact))                   errs.guardianContact  = 'Enter a valid 10-digit number'
    if (!formData.guardianRelation)                                       errs.guardianRelation = 'Guardian relation is required'
    if (!formData.joiningDate)                                            errs.joiningDate      = 'Joining date is required'
    if (!formData.durationMonths)                                         errs.durationMonths   = 'Duration is required'
    if (!formData.preferredRoomNumber)                                    errs.preferredRoomNumber = 'Please enter a room number'
    else if (selectedRoom && allRooms.length > 0) {
      const room = allRooms.find(r => r.roomNumber === formData.preferredRoomNumber.trim().toUpperCase())
      if (!room) {
        errs.preferredRoomNumber = `Room ${formData.preferredRoomNumber} does not exist. Valid rooms: R1–R9`
      } else if (room.roomTypeSlug !== selectedRoom.slug) {
        errs.preferredRoomNumber = `Room ${room.roomNumber} is ${room.roomTypeTitle}, not ${selectedRoom.title}. Enter a valid room.`
      } else if (room.full) {
        errs.preferredRoomNumber = `Room ${room.roomNumber} is fully occupied.`
      }
    }
    if (!formData.selectedBedNumber)                                      errs.selectedBedNumber   = 'Please enter a bed number'
    if (!formData.idProofType)                                            errs.idProofType      = 'ID type is required'
    if (!idProofFile)                                                     errs.idProofFile      = 'ID proof upload is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed) {
      showToast.warning('Agreement Required', 'Please read and accept the PG Rules & Policies.')
      return
    }

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      showToast.error(`${Object.keys(errs).length} Fields Need Attention`, 'Fill in all required fields highlighted in red.')
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)
    const toastId = showToast.loading('Submitting Application...', 'Uploading your details. Please wait.')
    try {
      // roomTypeSlug: backend derives it from preferredRoomNumber automatically
      // We still send it as a fallback from selectedRoom
      const chosenRoom = allRooms.find(r => r.roomNumber === formData.preferredRoomNumber)
      const roomTypeSlug = chosenRoom?.roomTypeSlug || selectedRoom?.slug || '3-sharing'

      const payload = {
        fullName:            formData.fullName.trim(),
        mobile:              formData.mobile.trim(),
        alternateMobile:     formData.alternateMobile.trim() || null,
        email:               formData.email.trim(),
        address:             formData.address.trim(),
        city:                formData.city.trim(),
        state:               formData.state.trim(),
        occupation:          formData.occupation,
        institutionName:     formData.institutionName.trim(),
        courseOrRole:        formData.courseOrRole.trim(),
        guardianName:        formData.guardianName.trim(),
        guardianContact:     formData.guardianContact.trim(),
        guardianRelation:    formData.guardianRelation || null,
        joiningDate:         formData.joiningDate,
        durationMonths:      parseInt(formData.durationMonths),
        roomTypeSlug,
        preferredRoomNumber: formData.preferredRoomNumber,
        selectedBedNumber:   formData.selectedBedNumber ? parseInt(formData.selectedBedNumber) : null,
        depositAmount:       formData.depositAmount ? parseFloat(formData.depositAmount) : null,
        paymentMode:         formData.paymentMode || null,
        transactionId:       formData.transactionId.trim() || null,
        idProofType:         formData.idProofType || null,
      }

      const fd = new FormData()
      fd.append('data', JSON.stringify(payload))
      if (idProofFile) fd.append('idProof', idProofFile)
      if (photoFile)   fd.append('photo', photoFile)

      const res = await applicationApi.submit(fd)
      setSavedAppId(res?.data?.id || null)
      showToast.update(toastId, 'success', 'Details Saved! 💳', 'Now complete your advance payment.')
      onSubmit?.()
      setShowUPI(true)   // Show UPI payment screen
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      showToast.update(toastId, 'error', 'Submission Failed',
        err.message || 'Something went wrong. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── UPI Payment Screen ────────────────────────────────────────────────────
  if (showUPI) {
    const upiLink = UPI_DEEP_LINK(ADVANCE_AMT)
    const qrUrl   = QR_URL(ADVANCE_AMT)

    // Payment app deep links
    const payApps = [
      {
        name: 'PhonePe',
        color: '#5f259f',
        icon: '📱',
        // PhonePe UPI deep link
        link: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${ADVANCE_AMT}&cu=INR&tn=${encodeURIComponent('HK PG Advance')}`,
        fallback: `https://phon.pe/ru_${UPI_ID}`,
      },
      {
        name: 'Google Pay',
        color: '#1a73e8',
        icon: '💳',
        link: `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${ADVANCE_AMT}&cu=INR&tn=${encodeURIComponent('HK PG Advance')}`,
        fallback: `https://pay.google.com/`,
      },
      {
        name: 'Paytm',
        color: '#00b9f1',
        icon: '💰',
        link: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${ADVANCE_AMT}&cu=INR`,
        fallback: `https://paytm.com/`,
      },
    ]

    const handleAppPay = (app) => {
      // Try deep link first — if app not installed, fallback to web
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      iframe.src = app.link
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1500)
      // Fallback after 2s if app didn't open
      setTimeout(() => {
        window.open(app.fallback, '_blank')
      }, 2000)
    }

    const handleIPaid = () => {
      setShowUPI(false)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-2">💳</div>
          <h2 className="text-2xl font-extrabold text-gray-800">Complete Your Payment</h2>
          <p className="text-gray-500 text-sm mt-1">Pay advance to confirm your bed booking</p>
        </div>

        {/* Amount Card */}
        <div className="rounded-2xl p-5 text-center border-2 border-pink-200"
          style={{ background: 'linear-gradient(135deg, #fff0f6, #fdf3e7)' }}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Advance Amount</p>
          <p className="text-5xl font-extrabold" style={{ color: '#c026d3' }}>
            ₹{ADVANCE_AMT.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-500 mt-2">One-time advance to confirm your booking</p>
          <p className="text-xs text-gray-400 mt-1">Remaining amount payable on joining day</p>
        </div>

        {/* UPI ID */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Pay to UPI ID</p>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <span className="font-mono font-bold text-gray-800 text-base">{UPI_ID}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(UPI_ID)
                showToast.success('Copied!', 'UPI ID copied to clipboard')
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)', color: 'white' }}
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">Name: <strong>{UPI_NAME}</strong></p>
        </div>

        {/* Pay via App Buttons */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">
            Pay Directly via App
          </p>
          <div className="grid grid-cols-3 gap-3">
            {payApps.map(app => (
              <button
                key={app.name}
                type="button"
                onClick={() => handleAppPay(app)}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 font-bold text-white text-xs transition-all hover:scale-105 active:scale-95 shadow-sm"
                style={{ background: app.color, borderColor: app.color }}
              >
                <span className="text-2xl">{app.icon}</span>
                <span>{app.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-gray-400 mt-3">
            Tap to open app → Pay ₹{ADVANCE_AMT} → Come back here
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Or Scan QR Code
          </p>
          <div className="flex justify-center">
            <div className="p-3 bg-white rounded-2xl border-2 border-pink-100 shadow-sm inline-block">
              <img
                src={qrUrl}
                alt="UPI QR Code"
                className="w-44 h-44"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Scan with any UPI app</p>
          {/* Direct UPI link for mobile */}
          <a
            href={upiLink}
            className="inline-block mt-3 text-xs font-bold px-4 py-2 rounded-xl text-white transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
          >
            Open UPI App →
          </a>
        </div>

        {/* Steps */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-blue-700 mb-2">📋 Steps to Pay:</p>
          <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
            <li>Tap any payment app button above</li>
            <li>Pay ₹{ADVANCE_AMT} to <strong>{UPI_ID}</strong></li>
            <li>Come back to this page</li>
            <li>Click <strong>"I Have Paid"</strong> below</li>
          </ol>
        </div>

        {/* I Paid Button */}
        <button
          type="button"
          onClick={handleIPaid}
          className="w-full py-4 rounded-2xl font-extrabold text-white text-base shadow-lg transition hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
        >
          ✅ I Have Paid — Confirm Booking
        </button>

        <p className="text-center text-xs text-gray-400">
          Having trouble? Call us:{' '}
          <a href="tel:9579828996" className="text-pink-600 font-bold">9579828996</a>
        </p>
      </div>
    )
  }

  // ── Final Success Screen ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="text-center space-y-5">
        {/* Animated checkmark */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            🎉
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Booking Received!</h2>
          <p className="text-gray-500 text-sm mt-1">Thanks for choosing us 🙏</p>
        </div>

        {/* Status message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <p className="text-yellow-800 font-bold text-sm mb-1">⏳ Pending Verification</p>
          <p className="text-yellow-700 text-sm leading-relaxed">
            Your booking will be <strong>confirmed after payment verification</strong> by our team.
            We'll contact you within <strong>24 hours</strong>.
          </p>
        </div>

        {/* Room info */}
        {selectedRoom && (
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2">Your Selected Room</p>
            <p className="font-extrabold text-gray-800">{selectedRoom.title}</p>
            <p className="font-bold text-lg mt-1" style={{ color: '#c026d3' }}>
              ₹{Number(selectedRoom.monthlyPrice || 0).toLocaleString('en-IN')}/mo
            </p>
          </div>
        )}

        {/* What happens next */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-left">
          <p className="text-xs font-bold text-green-700 mb-2">✅ What happens next:</p>
          <ol className="text-xs text-green-600 space-y-1.5 list-decimal list-inside">
            <li>Our team verifies your payment</li>
            <li>We confirm your bed is reserved</li>
            <li>You receive a call/WhatsApp confirmation</li>
            <li>Visit us on your joining date with documents</li>
          </ol>
        </div>

        {/* Contact */}
        <div className="flex justify-center gap-3 flex-wrap">
          <a href="tel:9579828996"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            📞 9579828996
          </a>
          <a href="tel:9096398032"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
            📞 9096398032
          </a>
          <a href={`https://wa.me/919579828996?text=${encodeURIComponent('Hi! I just paid the advance for HK PG booking. Please confirm my booking.')}`}
            target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}>
            💬 WhatsApp
          </a>
        </div>

        <button
          onClick={onAfterSubmit}
          className="w-full py-3 rounded-2xl font-bold text-sm border-2 border-pink-200 text-pink-600 hover:bg-pink-50 transition"
        >
          View Room Status →
        </button>

        <p className="text-xs text-gray-400 italic">
          "Have a nice day! We look forward to welcoming you at HK PG 🏠"
        </p>
      </div>
    )
  }

  const fe = fieldErrors
  // Selected room info for display
  const chosenRoomInfo = allRooms.find(r => r.roomNumber === formData.preferredRoomNumber)

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

      <div className="text-center mb-2">
        <h1 className="text-2xl font-extrabold text-gray-800">🧑‍🎓 Admission Application</h1>
        <p className="text-gray-400 text-xs mt-1">HK PG – Boys Accommodation · Akurdi, Pune</p>
      </div>

      {/* Selected Room Type Banner */}
      {selectedRoom ? (
        <div className="rounded-2xl overflow-hidden shadow-sm flex border border-pink-100">
          <img src={selectedRoom.imageUrl || selectedRoom.image} alt={selectedRoom.title}
            className="w-28 h-24 object-cover flex-shrink-0"
            onError={e => { e.target.style.display = 'none' }} />
          <div className="flex-1 px-4 py-3 flex flex-col justify-center"
            style={{ background: 'linear-gradient(135deg, #fff0f6, #fdf3e7)' }}>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-1 bg-pink-100 text-pink-600">
              {selectedRoom.tag}
            </span>
            <p className="font-extrabold text-gray-800 text-sm">{selectedRoom.title}</p>
            <p className="font-extrabold text-base mt-1" style={{ color: '#c026d3' }}>
              ₹{Number(selectedRoom.monthlyPrice || 0).toLocaleString('en-IN')}/mo
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-pink-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-pink-700 font-medium">
          🏠 General Enquiry — No specific room type selected
        </div>
      )}

      {/* 1. Basic Info */}
      <Section title="🔹 Basic Info">
        <Field label="Full Name" required error={fe.fullName}>
          <input id="fullName" type="text" placeholder="e.g. Rahul Sharma"
            className={`${inputCls} ${fe.fullName ? errCls : ''}`}
            value={formData.fullName} onChange={set('fullName')} />
        </Field>
        <Field label="Profile Photo">
          <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])}
            className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 file:font-semibold hover:file:bg-pink-100" />
        </Field>
      </Section>

      {/* 2. Contact */}
      <Section title="📞 Contact Details">
        <Field label="Mobile Number" required error={fe.mobile}>
          <input id="mobile" type="tel" placeholder="10-digit number" maxLength={10}
            className={`${inputCls} ${fe.mobile ? errCls : ''}`}
            value={formData.mobile} onChange={set('mobile')} />
        </Field>
        <Field label="Alternate Number">
          <input type="tel" placeholder="Optional" maxLength={10} className={inputCls}
            value={formData.alternateMobile} onChange={set('alternateMobile')} />
        </Field>
        <Field label="Email ID" required error={fe.email}>
          <input id="email" type="email" placeholder="example@email.com"
            className={`${inputCls} ${fe.email ? errCls : ''}`}
            value={formData.email} onChange={set('email')} />
        </Field>
      </Section>

      {/* 3. Permanent Address */}
      <Section title="🏠 Permanent Address">
        <Field label="Full Address" required error={fe.address}>
          <textarea id="address" rows={2} placeholder="House No, Street, Area"
            className={`${inputCls} resize-none ${fe.address ? errCls : ''}`}
            value={formData.address} onChange={set('address')} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" required error={fe.city}>
            <input id="city" type="text" placeholder="City"
              className={`${inputCls} ${fe.city ? errCls : ''}`}
              value={formData.city} onChange={set('city')} />
          </Field>
          <Field label="State" required error={fe.state}>
            <input id="state" type="text" placeholder="State"
              className={`${inputCls} ${fe.state ? errCls : ''}`}
              value={formData.state} onChange={set('state')} />
          </Field>
        </div>
      </Section>

      {/* 4. Student / Work Info */}
      <Section title="🎓 Student / Working Info">
        <Field label="Occupation" required error={fe.occupation}>
          <select id="occupation" className={`${selectCls} ${fe.occupation ? errCls : ''}`}
            value={formData.occupation} onChange={set('occupation')}>
            <option value="">Select</option>
            <option value="Student">Student</option>
            <option value="Working Professional">Working Professional</option>
          </select>
        </Field>
        <Field label="College / Company Name" required error={fe.institutionName}>
          <input id="institutionName" type="text" placeholder="e.g. PCCOE / Infosys"
            className={`${inputCls} ${fe.institutionName ? errCls : ''}`}
            value={formData.institutionName} onChange={set('institutionName')} />
        </Field>
        <Field label="Course / Job Role" required error={fe.courseOrRole}>
          <input id="courseOrRole" type="text" placeholder="e.g. B.Tech CSE / Software Engineer"
            className={`${inputCls} ${fe.courseOrRole ? errCls : ''}`}
            value={formData.courseOrRole} onChange={set('courseOrRole')} />
        </Field>
      </Section>

      {/* 5. Guardian */}
      <Section title="👨‍👩‍👧 Guardian Details">
        <Field label="Guardian Name" required error={fe.guardianName}>
          <input id="guardianName" type="text" placeholder="Parent / Guardian full name"
            className={`${inputCls} ${fe.guardianName ? errCls : ''}`}
            value={formData.guardianName} onChange={set('guardianName')} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Guardian Contact" required error={fe.guardianContact}>
            <input id="guardianContact" type="tel" placeholder="Mobile number" maxLength={10}
              className={`${inputCls} ${fe.guardianContact ? errCls : ''}`}
              value={formData.guardianContact} onChange={set('guardianContact')} />
          </Field>
          <Field label="Relation" required error={fe.guardianRelation}>
            <select id="guardianRelation" className={`${selectCls} ${fe.guardianRelation ? errCls : ''}`}
              value={formData.guardianRelation} onChange={set('guardianRelation')}>
              <option value="">Select</option>
              <option value="FATHER">Father</option>
              <option value="MOTHER">Mother</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* 6. Room & Stay Details */}
      <Section title="🛏️ Room & Stay Details">

        {/* Info: valid rooms for selected type */}
        {selectedRoom && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-xs text-blue-700 font-semibold">
            ℹ️ You selected <strong>{selectedRoom.title}</strong>. Only rooms of this type are shown below.
          </div>
        )}

        {/* Dropdown 1: Room Number */}
        <Field label="Room No." required error={fe.preferredRoomNumber}>
          <select
            id="preferredRoomNumber"
            className={`${selectCls} ${fe.preferredRoomNumber ? errCls : ''}`}
            value={formData.preferredRoomNumber}
            onChange={e => {
              const val = e.target.value
              // Reset bed when room changes
              setFormData(f => ({ ...f, preferredRoomNumber: val, selectedBedNumber: '' }))
              if (fieldErrors.preferredRoomNumber) setFieldErrors(fe => ({ ...fe, preferredRoomNumber: '' }))
              if (fieldErrors.selectedBedNumber)   setFieldErrors(fe => ({ ...fe, selectedBedNumber: '' }))
            }}
          >
            <option value="">— Select Room Number —</option>
            {/* Filter rooms to match selected type only */}
            {(() => {
              const validRooms = selectedRoom?.slug
                ? allRooms.filter(r => r.roomTypeSlug === selectedRoom.slug)
                : allRooms
              return ['1st Floor', '2nd Floor'].map(floor => {
                const floorRooms = validRooms.filter(r => r.floor === floor)
                if (floorRooms.length === 0) return null
                return (
                  <optgroup key={floor} label={`🏢 ${floor}`}>
                    {floorRooms.map(r => (
                      <option key={r.id} value={r.roomNumber} disabled={r.full}>
                        {r.roomNumber} — {r.roomTypeTitle}
                        {r.full ? ' (Full)' : ` — ${r.vacantBeds} bed${r.vacantBeds !== 1 ? 's' : ''} free`}
                      </option>
                    ))}
                  </optgroup>
                )
              })
            })()}
          </select>
        </Field>

        {/* Dropdown 2: Bed Number — auto-populated from selected room */}
        <Field label="Bed No." required error={fe.selectedBedNumber}>
          {(() => {
            const selectedRoomData = allRooms.find(r => r.roomNumber === formData.preferredRoomNumber)
            if (!formData.preferredRoomNumber || !selectedRoomData) {
              return (
                <select disabled className={`${selectCls} opacity-50 cursor-not-allowed`}>
                  <option>— Select a room first —</option>
                </select>
              )
            }
            const start    = selectedRoomData.bedStart || 1
            const total    = selectedRoomData.bedsPerRoom
            const occupied = selectedRoomData.occupiedBeds
            // Generate bed numbers — mark as unavailable if confirmed-occupied OR has any PENDING booking
            const beds = Array.from({ length: total }, (_, i) => ({
              num:        start + i,
              isOccupied: i < occupied || bookedBeds.includes(start + i),
            }))
            return (
              <select
                id="selectedBedNumber"
                className={`${selectCls} ${fe.selectedBedNumber ? errCls : ''}`}
                value={formData.selectedBedNumber}
                onChange={e => {
                  setFormData(f => ({ ...f, selectedBedNumber: e.target.value }))
                  if (fieldErrors.selectedBedNumber) setFieldErrors(fe => ({ ...fe, selectedBedNumber: '' }))
                }}
              >
                <option value="">— Select Bed Number —</option>
                {beds.map(b => (
                  <option key={b.num} value={b.num} disabled={b.isOccupied}>
                    Bed {b.num}{b.isOccupied ? ' — Occupied ❌' : ' — Available ✅'}
                  </option>
                ))}
              </select>
            )
          })()}
          {formData.preferredRoomNumber && (() => {
            const r = allRooms.find(x => x.roomNumber === formData.preferredRoomNumber)
            if (!r) return null
            const s = r.bedStart || 1
            const e = s + r.bedsPerRoom - 1
            return (
              <p className="text-xs text-gray-400 mt-1">
                {r.roomNumber} has beds {r.bedsPerRoom === 1 ? s : `${s}–${e}`} · {r.vacantBeds} of {r.bedsPerRoom} free
              </p>
            )
          })()}
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Joining Date" required error={fe.joiningDate}>
            <input id="joiningDate" type="date"
              className={`${inputCls} ${fe.joiningDate ? errCls : ''}`}
              value={formData.joiningDate} onChange={set('joiningDate')} />
          </Field>
          <Field label="Duration (months)" required error={fe.durationMonths}>
            <select id="durationMonths" className={`${selectCls} ${fe.durationMonths ? errCls : ''}`}
              value={formData.durationMonths} onChange={set('durationMonths')}>
              <option value="">Select</option>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* 7. Payment */}
      <Section title="💰 Payment Info">
        <Field label="Deposit Amount (₹)">
          <input type="number" placeholder="e.g. 5000" className={inputCls}
            value={formData.depositAmount} onChange={set('depositAmount')} />
        </Field>
        <Field label="Payment Mode">
          <select className={selectCls} value={formData.paymentMode} onChange={set('paymentMode')}>
            <option value="">Select</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="ONLINE_TRANSFER">Online Transfer</option>
          </select>
        </Field>
        <Field label="Transaction ID (if online)">
          <input type="text" placeholder="UPI / Bank transaction ID" className={inputCls}
            value={formData.transactionId} onChange={set('transactionId')} />
        </Field>
      </Section>

      {/* 8. ID Proof */}
      <Section title="📄 ID Proof Upload">
        <Field label="ID Type" required error={fe.idProofType}>
          <select id="idProofType" className={`${selectCls} ${fe.idProofType ? errCls : ''}`}
            value={formData.idProofType} onChange={set('idProofType')}>
            <option value="">Select ID type</option>
            <option value="AADHAAR_CARD">Aadhaar Card</option>
            <option value="PAN_CARD">PAN Card</option>
            <option value="COLLEGE_ID">College ID</option>
            <option value="PASSPORT">Passport</option>
          </select>
        </Field>
        <Field label="Upload ID Proof" required error={fe.idProofFile}>
          <input id="idProofFile" type="file" accept=".jpg,.jpeg,.png,.pdf"
            onChange={e => { setIdProofFile(e.target.files[0]); setFieldErrors(fe => ({ ...fe, idProofFile: '' })) }}
            className={`w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 file:font-semibold hover:file:bg-pink-100 ${fe.idProofFile ? 'border border-red-400 rounded-xl p-1' : ''}`} />
          <p className="text-xs text-gray-400 mt-1">Accepted: JPG, PNG, PDF (max 5MB)</p>
        </Field>
      </Section>

      {/* ── Export to Excel — ADMIN ONLY ─────────────────────────────────── */}
      {isAdmin && (
        <button
          type="button"
          onClick={() => exportToExcel(formData, selectedRoom, allRooms)}
          className="w-full py-3 rounded-2xl font-bold text-sm border-2 border-green-500 text-green-700 bg-green-50 hover:bg-green-100 transition flex items-center justify-center gap-2"
        >
          📊 Export Form Data to Excel (.csv)
          <span className="text-xs font-normal text-green-600">(Admin Only)</span>
        </button>
      )}

      {/* 9. Agreement */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-pink-600" />
          <span className="text-sm text-gray-700">
            I have read and agree to the{' '}
            <span className="text-pink-600 font-semibold">PG Rules & Policies</span>,
            including entry timings, visitor rules, notice period, and payment terms.
          </span>
        </label>
      </div>

      {/* 10. Submit */}
      <button type="submit" disabled={loading}
        className="w-full font-extrabold py-4 rounded-2xl text-white text-base shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
        {loading ? '⏳ Submitting...' : '✅ Submit Application'}
      </button>

    </form>
  )
}
