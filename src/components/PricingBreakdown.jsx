const pricing = [
  { label: 'Monthly Rent', value: '₹5,500 – ₹8,500', highlight: false },
  { label: 'Security Deposit', value: '₹10,000 (refundable)', highlight: false },
  { label: 'Maintenance', value: '₹500 / month', highlight: false },
  { label: 'Electricity', value: 'Included (fair use)', highlight: false },
  { label: 'Food Charges', value: 'Included in rent', highlight: false },
  { label: 'Extra Charges', value: 'None 🎉', highlight: true },
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
