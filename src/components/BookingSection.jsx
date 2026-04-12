import { useState } from 'react'

export default function BookingSection({ onBook }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name && phone) onBook()
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
      <h2 className="text-lg font-bold mb-1">📅 Book a Visit</h2>
      <p className="text-blue-100 text-sm mb-4">Available from: 1st May 2026</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-white/20 placeholder-blue-200 text-white border border-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white/30"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full bg-white/20 placeholder-blue-200 text-white border border-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white/30"
        />
        <button
          type="submit"
          className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition text-sm"
        >
          🏠 Enquire Now / Book Visit
        </button>
      </form>
    </div>
  )
}
