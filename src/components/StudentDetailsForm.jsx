import { useState, useEffect } from 'react'
import { showToast } from '../components/Toast'
import { applicationApi, roomApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import UPIPaymentScreen from './UPIPaymentScreen'
import BookingSuccessScreen from './BookingSuccessScreen'

// ── UPI Config — change these to owner's actual UPI details ──────────────────
const UPI_ID      = 'hkpgakurdi@upi'   // ← Replace with actual UPI ID
const UPI_NAME    = 'HK PG Akurdi'
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

  // Auto-fill deposit amount from selected room type
  useEffect(() => {
    if (selectedRoom?.securityDeposit && !formData.depositAmount) {
      setFormData(f => ({ ...f, depositAmount: String(selectedRoom.securityDeposit) }))
    }
  }, [selectedRoom])

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
