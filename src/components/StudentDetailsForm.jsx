import { useState, useEffect } from 'react'
import { showToast } from '../components/Toast'
import { applicationApi, roomApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import UPIPaymentScreen from './UPIPaymentScreen'
import BookingSuccessScreen from './BookingSuccessScreen'

// ── UPI Config — Owner's actual UPI details ──────────────────────────────────
const UPI_ID      = '9579828996@ybl'        // Owner's PhonePe UPI ID
const UPI_NAME    = 'Krishna Pandurang Pawar' // Owner's name as on PhonePe
// QR code generated via UPI deep link using a free QR API
const UPI_DEEP_LINK = (amount) =>
  `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}${amount ? `&am=${amount}` : ''}&cu=INR&tn=${encodeURIComponent('HK PG Security Deposit')}`
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

const STORAGE_KEY        = 'hkpg_application_draft'
const AGREED_STORAGE_KEY = 'hkpg_rules_accepted'

export default function StudentDetailsForm({ selectedRoom, onSubmit, onAfterSubmit }) {
  const { user }                      = useAuth()
  const isAdmin                       = user?.role === 'admin'

  // Load saved draft from localStorage on mount
  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return { ...INIT, ...JSON.parse(saved) }
    } catch {}
    return INIT
  }

  // Load agreed state from localStorage (persisted across tab navigation)
  const loadAgreed = () => {
    try { return localStorage.getItem(AGREED_STORAGE_KEY) === 'true' } catch {}
    return false
  }

  const [agreed, setAgreed]           = useState(() => loadAgreed())
  const [submitted, setSubmitted]     = useState(false)
  const [showUPI, setShowUPI]         = useState(false)   // UPI payment screen
  const [upiConfirmed, setUpiConfirmed] = useState(false) // user clicked "I Paid"
  const [savedAppId, setSavedAppId]   = useState(null)    // saved application ID
  const [loading, setLoading]         = useState(false)
  const [formData, setFormData]       = useState(() => loadDraft())
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

  // Auto-fill deposit amount from selected room type
  useEffect(() => {
    if (selectedRoom?.securityDeposit && !formData.depositAmount) {
      setFormData(f => ({ ...f, depositAmount: String(selectedRoom.securityDeposit) }))
    }
  }, [selectedRoom])

  // Save draft to localStorage whenever form changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      // Show a subtle indication that data is being saved
      if (formData.fullName || formData.mobile) {
        // Only show save indicator if user has started filling the form
        const saveIndicator = document.getElementById('save-indicator')
        if (saveIndicator) {
          saveIndicator.style.opacity = '1'
          setTimeout(() => {
            if (saveIndicator) saveIndicator.style.opacity = '0'
          }, 1000)
        }
      }
    } catch {}
  }, [formData])

  // Persist agreed state to localStorage
  useEffect(() => {
    try { localStorage.setItem(AGREED_STORAGE_KEY, String(agreed)) } catch {}
  }, [agreed])

  // Listen for rules acceptance from the rules tab (cross-tab sync via storage event)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === AGREED_STORAGE_KEY && e.newValue === 'true') {
        setAgreed(true)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

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
    if (!formData.depositAmount)                                          errs.depositAmount       = 'Please enter deposit amount'
    if (!photoFile)                                                       errs.photoFile           = 'Profile photo is required'
    if (!formData.idProofType)                                            errs.idProofType      = 'ID type is required'
    if (!idProofFile)                                                     errs.idProofFile      = 'ID proof upload is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed) {
      showToast.warning('Rules Acceptance Required', 'Please read the complete Rules & Regulations and check the agreement box to proceed.')
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
        email:               user?.email || formData.email?.trim() || '',  // use logged-in user's email
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
      // Clear saved draft after successful submission
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(AGREED_STORAGE_KEY)
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
    const depositAmt = formData.depositAmount ? parseFloat(formData.depositAmount) : null
    return (
      <UPIPaymentScreen
        amount={depositAmt}
        upiId={UPI_ID}
        upiName={UPI_NAME}
        selectedRoom={selectedRoom}
        bedNumber={formData.selectedBedNumber}
        roomNumber={formData.preferredRoomNumber}
        showToast={showToast}
        onIPaid={() => {
          setShowUPI(false)
          setSubmitted(true)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  // ── Final Success Screen ──────────────────────────────────────────────────
  if (submitted) {
    const depositAmt = formData.depositAmount ? parseFloat(formData.depositAmount) : null
    return (
      <BookingSuccessScreen
        selectedRoom={selectedRoom}
        advanceAmount={depositAmt}
        onAfterSubmit={onAfterSubmit}
      />
    )
  }

  const fe = fieldErrors
  // Selected room info for display
  const chosenRoomInfo = allRooms.find(r => r.roomNumber === formData.preferredRoomNumber)

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

      {/* Auto-save indicator */}
      <div 
        id="save-indicator"
        className="fixed top-20 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold opacity-0 transition-opacity duration-300 z-50"
      >
        ✅ Draft Saved
      </div>

      <div className="text-center mb-2">
        <h1 className="text-2xl font-extrabold text-gray-800">🧑‍🎓 Admission Application</h1>
        <p className="text-gray-400 text-xs mt-1">HK PG – Boys Accommodation · Akurdi, Pune</p>
        
        {/* Data persistence notice */}
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
          <p className="text-xs text-blue-700">
            💾 <strong>Your data is automatically saved</strong> - You can safely navigate to read rules and return without losing your progress
          </p>
        </div>
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
        <Field label="Profile Photo" required error={fe.photoFile}>
          <div className="space-y-2">
            {/* Preview */}
            {photoFile && (
              <div className="flex items-center gap-3 p-2 bg-pink-50 rounded-xl border border-pink-100">
                <img
                  src={URL.createObjectURL(photoFile)}
                  alt="Preview"
                  className="w-14 h-14 rounded-full object-cover border-2 border-pink-200 shadow"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-700">{photoFile.name}</p>
                  <p className="text-xs text-green-600 font-medium mt-0.5">✓ Photo selected</p>
                </div>
                <button type="button" onClick={() => setPhotoFile(null)}
                  className="ml-auto text-gray-400 hover:text-red-500 transition text-lg">×</button>
              </div>
            )}
            <input
              id="photoFile"
              type="file"
              accept="image/*"
              onChange={e => {
                setPhotoFile(e.target.files[0] || null)
                if (fieldErrors.photoFile) setFieldErrors(fe => ({ ...fe, photoFile: '' }))
              }}
              className={`w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 file:font-semibold hover:file:bg-pink-100 ${fe.photoFile ? 'border border-red-400 rounded-xl p-1' : ''}`}
            />
            <p className="text-xs text-gray-400">JPG or PNG, max 5MB. This photo will appear on your dashboard.</p>
          </div>
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
            <select id="state" className={`${selectCls} ${fe.state ? errCls : ''}`}
              value={formData.state} onChange={set('state')}>
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
              <option value="Delhi">Delhi</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Ladakh">Ladakh</option>
              <option value="Lakshadweep">Lakshadweep</option>
              <option value="Puducherry">Puducherry</option>
            </select>
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
        <Field label="Security Deposit Amount (₹)" required error={fe.depositAmount}>
          <input
            id="depositAmount"
            type="number"
            placeholder="One month deposit (e.g. ₹6000)"
            className={`${inputCls} ${fe.depositAmount ? errCls : ''}`}
            value={formData.depositAmount}
            onChange={set('depositAmount')}
          />
          {selectedRoom && (
            <p className="text-xs text-gray-400 mt-1">
              Security deposit for {selectedRoom.title}: ₹{Number(selectedRoom.securityDeposit || 0).toLocaleString('en-IN')}
            </p>
          )}
        </Field>
        <Field label="Payment Mode">
          <select className={selectCls} value={formData.paymentMode} onChange={set('paymentMode')}>
            <option value="">Select</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="ONLINE_TRANSFER">Online Transfer</option>
          </select>
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

      {/* 9. Mandatory Rules & Regulations */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-red-800 text-base">Mandatory: Read Complete Rules & Regulations</h3>
            <p className="text-red-600 text-sm">You must read and accept all rules before submitting your application</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-red-200 mb-4">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Important:</strong> The rules shown below are just a summary. Complete rules include payment policies, 
            security guidelines, visitor policies, and legal terms that are mandatory for all residents.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            <p className="text-xs text-green-700 font-semibold">
              💾 <strong>Don't worry about your form data!</strong> All your filled information is automatically saved. 
              You can safely read the complete rules and return - your progress will be preserved.
            </p>
          </div>
          
          <a
            href="/rules-and-regulations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            📋 Read Complete Rules & Regulations
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">MANDATORY</span>
          </a>
        </div>

        {/* Summary Rules */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 text-sm mb-2">📝 Quick Summary (Full details in complete rules):</h4>
          {[
            { icon: '💰', text: 'Rent due by 5th of every month (₹100/day late fee)' },
            { icon: '📅', text: '15-day advance notice required for vacating (online only)' },
            { icon: '👥', text: 'Visitors allowed in common area only (till 9 PM)' },
            { icon: '🚭', text: 'No smoking or drinking inside premises' },
            { icon: '🔇', text: 'No loud music after 10 PM' },
            { icon: '🧹', text: 'Keep your room and common areas clean' },
            { icon: '⚠️', text: 'Violence or misconduct leads to immediate termination' },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
              <span className="text-base flex-shrink-0">{r.icon}</span>
              <span className="text-xs text-gray-700 leading-relaxed">{r.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Agreement */}
      <div className={`border rounded-2xl p-4 ${agreed ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-200'}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-pink-600" />
          <span className="text-sm text-gray-700">
            I have read and agree to all the{' '}
            <strong className="text-pink-600">Complete Rules & Regulations</strong>{' '}
            including payment policies, security guidelines, visitor rules, notice periods, and all terms and conditions.
            I understand that violation of any rule may result in termination of accommodation without refund.
          </span>
        </label>
        {agreed && (
          <p className="text-xs text-green-700 font-semibold mt-2 ml-7">
            ✅ Rules accepted — you're good to submit!
          </p>
        )}
      </div>

      {/* 11. Submit */}
      <button type="submit" disabled={loading}
        className="w-full font-extrabold py-4 rounded-2xl text-white text-base shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
        {loading ? '⏳ Submitting...' : '✅ Submit Application'}
      </button>

    </form>
  )
}
