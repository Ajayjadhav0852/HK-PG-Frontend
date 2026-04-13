import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { showToast } from './Toast'
import { adminApi } from '../services/api'

const TAG_COLORS = {
  '1-sharing': 'bg-purple-100 text-purple-700',
  '2-sharing': 'bg-pink-100 text-pink-700',
  '3-sharing': 'bg-orange-100 text-orange-700',
  '4-sharing': 'bg-green-100 text-green-700',
}

// Fallback images if Cloudinary URL fails
const FALLBACK_IMAGES = {
  '1-sharing': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
  '2-sharing': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80',
  '3-sharing': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80',
  '4-sharing': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
}

const SLUGS = ['1-sharing', '2-sharing', '3-sharing', '4-sharing']

// ── Inline Edit Modal ─────────────────────────────────────────────────────────
function EditModal({ rt, slug, onClose, onSaved }) {
  const [form, setForm] = useState({
    monthlyPrice:    String(rt.monthlyPrice || ''),
    securityDeposit: String(rt.securityDeposit || ''),
    imageUrl:        rt.imageUrl || '',
    description:     rt.description || '',
  })
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(rt.imageUrl || '')

  const handleSave = async () => {
    if (!form.monthlyPrice || isNaN(form.monthlyPrice)) {
      showToast.error('Invalid Price', 'Monthly price must be a valid number.')
      return
    }
    setSaving(true)
    const id = showToast.loading('Saving...', `Updating ${rt.title}`)
    try {
      await adminApi.updateRoomType(slug, {
        monthlyPrice:    parseFloat(form.monthlyPrice),
        securityDeposit: parseFloat(form.securityDeposit),
        imageUrl:        form.imageUrl.trim() || undefined,
        description:     form.description.trim() || undefined,
      })
      showToast.update(id, 'success', 'Updated ✅', `${rt.title} has been saved.`)
      onSaved()
      onClose()
    } catch (e) {
      showToast.update(id, 'error', 'Save Failed', e.message || 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-gray-800 text-lg">✏️ Edit {rt.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">×</button>
        </div>

        {/* Image preview */}
        <div className="relative rounded-2xl overflow-hidden h-36 bg-gray-100">
          <img
            src={preview || FALLBACK_IMAGES[slug]}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={e => { e.target.src = FALLBACK_IMAGES[slug] }}
          />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
            Live Preview
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            📷 Image URL <span className="text-gray-400 font-normal">(Cloudinary or any direct URL)</span>
          </label>
          <input
            type="url"
            placeholder="https://res.cloudinary.com/..."
            value={form.imageUrl}
            onChange={e => { setForm(f => ({ ...f, imageUrl: e.target.value })); setPreview(e.target.value) }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />
          <p className="text-xs text-gray-400 mt-1">💡 Paste a Cloudinary URL for best performance.</p>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">💰 Monthly Rent (₹)</label>
            <input
              type="number"
              placeholder="e.g. 6000"
              value={form.monthlyPrice}
              onChange={e => setForm(f => ({ ...f, monthlyPrice: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">🔒 Security Deposit (₹)</label>
            <input
              type="number"
              placeholder="e.g. 8000"
              value={form.securityDeposit}
              onChange={e => setForm(f => ({ ...f, securityDeposit: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">📝 Description</label>
          <textarea
            rows={2}
            placeholder="Short description..."
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            disabled={saving}
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-extrabold text-white text-sm transition hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
          >
            {saving ? '⏳ Saving...' : '✅ Save Changes'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RoomTypesSection({ onBook, roomsState, onRoomUpdated }) {
  const { user }          = useAuth()
  const isAdmin           = user?.role === 'admin'
  const [editing, setEditing] = useState(null) // slug being edited

  return (
    <div className="w-full px-6 py-12"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      <div className="max-w-5xl mx-auto">

        <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          Accommodation
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#c026d3' }}>
          Choose Your Room Type
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          From private single rooms to budget-friendly quad sharing — HKPG has a space for every lifestyle and budget.
        </p>

        {/* Admin hint */}
        {isAdmin && (
          <p className="text-xs text-pink-500 font-semibold mb-6">
            👑 Admin: hover over any room card to edit price or image.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SLUGS.map(slug => {
            const rt       = roomsState[slug]
            const tagColor = TAG_COLORS[slug] || 'bg-gray-100 text-gray-600'
            const fallback = FALLBACK_IMAGES[slug]

            // Skeleton while loading
            if (!rt) return (
              <div key={slug} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded-xl mt-2" />
                </div>
              </div>
            )

            const vacantBeds  = rt.vacantBeds  ?? 0
            const totalBeds   = rt.totalBeds   ?? 0
            const vacantRooms = rt.vacantRooms ?? 0
            const totalRooms  = rt.totalRooms  ?? 0

            return (
              <div
                key={slug}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col group relative"
              >
                {/* ── Image with admin edit overlay ── */}
                <div
                  className="relative overflow-hidden h-44 bg-gray-100 cursor-pointer"
                  onClick={() => !isAdmin && onBook(slug)}
                >
                  <img
                    src={rt.imageUrl || fallback}
                    alt={rt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = fallback }}
                  />

                  {/* Vacancy badge */}
                  <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${tagColor}`}>
                    {rt.tag}
                  </span>
                  <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${vacantBeds > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {vacantBeds > 0 ? `🟢 ${vacantBeds} free` : '🔴 Full'}
                  </span>

                  {/* Admin: camera button on image hover */}
                  {isAdmin && (
                    <button
                      onClick={e => { e.stopPropagation(); setEditing(slug) }}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white"
                    >
                      <span className="text-3xl">📷</span>
                      <span className="text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Edit Image</span>
                    </button>
                  )}
                </div>

                {/* ── Card body ── */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h3 className="font-bold text-gray-800 text-base">{rt.title}</h3>
                  <p className="text-gray-500 text-sm flex-1 line-clamp-2">{rt.description}</p>

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>🏠 {vacantRooms}/{totalRooms} rooms</span>
                    <span>🛏️ {vacantBeds}/{totalBeds} beds</span>
                  </div>

                  {/* Price row with admin edit button */}
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-extrabold" style={{ color: '#c026d3' }}>
                      ₹{Number(rt.monthlyPrice).toLocaleString('en-IN')}/mo
                    </p>
                    {/* Admin: pencil icon next to price */}
                    {isAdmin && (
                      <button
                        onClick={e => { e.stopPropagation(); setEditing(slug) }}
                        title="Edit price & image"
                        className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-lg transition"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); onBook(slug) }}
                    className="mt-1 w-full py-2.5 rounded-xl font-bold text-sm text-white transition hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
                  >
                    {vacantBeds > 0 ? 'Book Now' : 'View Details'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Edit Modal */}
      {editing && roomsState[editing] && (
        <EditModal
          rt={roomsState[editing]}
          slug={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { onRoomUpdated?.(); setEditing(null) }}
        />
      )}
    </div>
  )
}
