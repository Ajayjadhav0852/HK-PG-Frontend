const kitchenFacilities = [
  { facility: 'Common Kitchen', description: 'Fully equipped shared kitchen for residents', available: true },
  { facility: 'Gas Stove', description: 'Multiple burner gas stoves available', available: true },
  { facility: 'Refrigerator', description: 'Shared refrigerator for food storage', available: true },
  { facility: 'Water Purifier', description: 'RO water purifier in kitchen area', available: true },
]

export default function FoodDetails() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🍳 Kitchen Facilities</h2>

      <div className="flex gap-3 mb-4">
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          🍳 Self Cooking Allowed
        </span>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          🥗 Common Kitchen Available
        </span>
      </div>

      <div className="space-y-2">
        {kitchenFacilities.map((f) => (
          <div
            key={f.facility}
            className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <div>
                <span className="font-semibold text-gray-700 text-sm">{f.facility}</span>
                <p className="text-xs text-gray-500">{f.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-xs text-yellow-700">
          <strong>Note:</strong> Food is not provided by the PG. Residents can cook in the common kitchen or order from nearby restaurants.
        </p>
      </div>
    </div>
  )
}
