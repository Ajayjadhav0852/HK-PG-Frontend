const meals = [
  { meal: 'Breakfast', time: '7:30 – 9:00 AM', included: true },
  { meal: 'Lunch', time: '12:30 – 2:00 PM', included: true },
  { meal: 'Dinner', time: '7:30 – 9:30 PM', included: true },
]

export default function FoodDetails() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🍽️ Food Details</h2>

      <div className="flex gap-3 mb-4">
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          ✅ Food Included
        </span>
        <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          🥗 Veg + Non-Veg
        </span>
      </div>

      <div className="space-y-2">
        {meals.map((m) => (
          <div
            key={m.meal}
            className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span className="font-semibold text-gray-700 text-sm">{m.meal}</span>
            </div>
            <span className="text-xs text-gray-500">{m.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
