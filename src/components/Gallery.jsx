import { useState } from 'react'

const photos = [
  { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80', label: 'Room' },
  { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80', label: 'Washroom' },
  { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', label: 'Building' },
  { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80', label: 'Common Area' },
  { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80', label: 'Room' },
  { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80', label: 'Room' },
]

export default function Gallery() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-4">📸 Gallery</h2>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p, i) => (
          <div
            key={i}
            className="relative cursor-pointer rounded-xl overflow-hidden aspect-square"
            onClick={() => setSelected(p)}
          >
            <img src={p.url} alt={p.label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
            <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
              {p.label}
            </span>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-lg w-full">
            <img src={selected.url} alt={selected.label} className="w-full rounded-2xl" />
            <button
              className="absolute top-2 right-2 bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
