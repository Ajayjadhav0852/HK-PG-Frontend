const pricing = [
  { label: 'Monthly Rent', value: '₹4,000 – ₹7,000', highlight: false },
  { label: 'Security Deposit', value: 'Same as monthly rent (refundable)', highlight: false },
  { label: 'Maintenance Charges', value: 'Zero ✅', highlight: false },
  { label: 'Electricity', value: 'Included (fair use)', highlight: false },
  { label: 'WiFi & Internet', value: 'Included', highlight: false },
  { label: 'Hidden Charges', value: 'None 🎉', highlight: true },
]

export default function PricingBreakdown() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-1">💰 Pricing Breakdown</h2>
      <p className="text-xs text-gray-400 mb-4">100% transparent — no hidden costs</p>

      <div className="space-y-2">
        {pricing.map((p) => (
          <div
            key={p.label}
            className={`flex justify-between items-center px-4 py-3 rounded-xl ${
              p.highlight ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
            }`}
          >
            <span className="text-sm text-gray-600">{p.label}</span>
            <span className={`text-sm font-semibold ${p.highlight ? 'text-green-600' : 'text-gray-800'}`}>
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
