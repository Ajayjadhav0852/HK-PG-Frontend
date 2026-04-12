import { useState } from 'react'

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition bg-white'
const selectCls = inputCls

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
    <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2">{title}</h3>
    {children}
  </div>
)

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
)

export default function StudentDetailsForm({ selectedRoom, onSubmit, onAfterSubmit }) {
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreed) { alert('Please accept the rules & policies.'); return }
    onSubmit?.()       // update bed count in App state
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Application Submitted!</h2>
        <p className="text-gray-500 text-sm mb-1">We'll contact you within 24 hours to confirm your room.</p>
        {selectedRoom && (
          <p className="text-sm font-semibold mt-2" style={{ color: '#c026d3' }}>
            Room: {selectedRoom.title} · {selectedRoom.price}
          </p>
        )}
        <div className="mt-4 flex justify-center gap-4 text-sm font-bold">
          <a href="tel:9579828996" className="text-pink-600 hover:underline">📞 9579828996</a>
          <a href="tel:9096398032" className="text-pink-600 hover:underline">📞 9096398032</a>
        </div>
        <button
          onClick={onAfterSubmit}
          className="mt-6 px-8 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition"
          style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
        >
          View Updated Room Status →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Page heading */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-extrabold text-gray-800">🧑‍🎓 Admission Application</h1>
        <p className="text-gray-400 text-xs mt-1">HK PG – Boys Accommodation · Akurdi, Pune</p>
      </div>

      {/* Selected Room Banner */}
      {selectedRoom ? (
        <div className="rounded-2xl overflow-hidden shadow-sm flex gap-0 border border-pink-100">
          <img src={selectedRoom.image} alt={selectedRoom.title} className="w-28 h-24 object-cover flex-shrink-0" />
          <div className="flex-1 px-4 py-3 flex flex-col justify-center"
            style={{ background: 'linear-gradient(135deg, #fff0f6, #fdf3e7)' }}>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-1 ${selectedRoom.tagColor}`}>
              {selectedRoom.tag}
            </span>
            <p className="font-extrabold text-gray-800 text-sm">{selectedRoom.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{selectedRoom.desc}</p>
            <p className="font-extrabold text-base mt-1" style={{ color: '#c026d3' }}>{selectedRoom.price}</p>
          </div>
        </div>
      ) : (
        <div className="bg-pink-50 border border-pink-100 rounded-2xl px-4 py-3 text-sm text-pink-700 font-medium">
          🏠 General Enquiry — No specific room selected
        </div>
      )}

      {/* 1. Basic Info */}
      <Section title="🔹 Basic Info">
        <Field label="Full Name" required>
          <input type="text" placeholder="e.g. Rahul Sharma" required className={inputCls} />
        </Field>
        <Field label="Profile Photo">
          <input type="file" accept="image/*"
            className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 file:font-semibold hover:file:bg-pink-100" />
        </Field>
      </Section>

      {/* 2. Contact */}
      <Section title="📞 Contact Details">
        <Field label="Mobile Number" required>
          <input type="tel" placeholder="10-digit number" required maxLength={10} className={inputCls} />
        </Field>
        <Field label="Alternate Number">
          <input type="tel" placeholder="Optional" maxLength={10} className={inputCls} />
        </Field>
        <Field label="Email ID" required>
          <input type="email" placeholder="example@email.com" required className={inputCls} />
        </Field>
      </Section>

      {/* 3. Permanent Address */}
      <Section title="🏠 Permanent Address">
        <Field label="Full Address" required>
          <textarea rows={2} placeholder="House No, Street, Area" required className={inputCls + ' resize-none'} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" required>
            <input type="text" placeholder="City" required className={inputCls} />
          </Field>
          <Field label="State" required>
            <input type="text" placeholder="State" required className={inputCls} />
          </Field>
        </div>
      </Section>

      {/* 4. Student / Work Info */}
      <Section title="🎓 Student / Working Info">
        <Field label="Occupation" required>
          <select required className={selectCls}>
            <option value="">Select</option>
            <option>Student</option>
            <option>Working Professional</option>
          </select>
        </Field>
        <Field label="College / Company Name" required>
          <input type="text" placeholder="e.g. Christ University / Infosys" required className={inputCls} />
        </Field>
        <Field label="Course / Job Role" required>
          <input type="text" placeholder="e.g. B.Tech CSE / Software Engineer" required className={inputCls} />
        </Field>
      </Section>

      {/* 5. Guardian */}
      <Section title="👨‍👩‍👧 Guardian Details">
        <Field label="Guardian Name" required>
          <input type="text" placeholder="Parent / Guardian full name" required className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Guardian Contact" required>
            <input type="tel" placeholder="Mobile number" required maxLength={10} className={inputCls} />
          </Field>
          <Field label="Relation" required>
            <select required className={selectCls}>
              <option value="">Select</option>
              <option>Father</option>
              <option>Mother</option>
              <option>Other</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* 6. Stay Details — room pre-filled */}
      <Section title="🛏️ Stay Details">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Joining Date" required>
            <input type="date" required className={inputCls} />
          </Field>
          <Field label="Duration (months)" required>
            <select required className={selectCls}>
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
          <input type="number" placeholder="e.g. 10000" className={inputCls} />
        </Field>
        <Field label="Payment Mode">
          <select className={selectCls}>
            <option value="">Select</option>
            <option>Cash</option>
            <option>UPI</option>
            <option>Online Transfer</option>
          </select>
        </Field>
        <Field label="Transaction ID (if online)">
          <input type="text" placeholder="UPI / Bank transaction ID" className={inputCls} />
        </Field>
      </Section>

      {/* 8. ID Proof */}
      <Section title="📄 ID Proof Upload">
        <Field label="ID Type" required>
          <select required className={selectCls}>
            <option value="">Select ID type</option>
            <option>Aadhaar Card</option>
            <option>PAN Card</option>
            <option>College ID</option>
            <option>Passport</option>
          </select>
        </Field>
        <Field label="Upload ID Proof" required>
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" required
            className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 file:font-semibold hover:file:bg-pink-100" />
          <p className="text-xs text-gray-400 mt-1">Accepted: JPG, PNG, PDF (max 5MB)</p>
        </Field>
      </Section>

      {/* 9. Agreement */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-pink-600"
          />
          <span className="text-sm text-gray-700">
            I have read and agree to the{' '}
            <span className="text-pink-600 font-semibold">PG Rules & Policies</span>,
            including entry timings, visitor rules, notice period, and payment terms.
          </span>
        </label>
      </div>

      {/* 10. Submit */}
      <button
        type="submit"
        className="w-full font-extrabold py-4 rounded-2xl text-white text-base shadow-lg transition hover:opacity-90 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
      >
        ✅ Submit Application
      </button>

    </form>
  )
}
