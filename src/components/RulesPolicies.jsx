import { useState } from 'react'

const rules = [
  { icon: '🕙', text: 'Entry timing: 6 AM – 10:30 PM' },
  { icon: '👥', text: 'Visitors allowed in common area only (till 8 PM)' },
  { icon: '🚭', text: 'No smoking or drinking inside premises' },
  { icon: '📅', text: 'Notice period: 30 days before vacating' },
  { icon: '🔇', text: 'No loud music after 10 PM' },
  { icon: '🧹', text: 'Keep your room clean — housekeeping 3x/week' },
]

export default function RulesPolicies() {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-lg font-bold text-gray-800">📜 Rules & Policies</h2>
        <span className="text-gray-400 text-xl">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-2">
          {rules.map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-lg">{r.icon}</span>
              <span className="text-sm text-gray-700">{r.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
