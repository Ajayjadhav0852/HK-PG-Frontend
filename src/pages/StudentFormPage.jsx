import StudentDetailsForm from '../components/StudentDetailsForm'

export default function StudentFormPage({ onBack, selectedRoom, onSubmit, onAfterSubmit }) {
  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="mb-5 flex items-center gap-2 text-pink-600 hover:text-pink-800 font-semibold text-sm"
        >
          ← Back
        </button>
        <StudentDetailsForm
          selectedRoom={selectedRoom}
          onSubmit={onSubmit}
          onAfterSubmit={onAfterSubmit}
        />
      </div>
    </div>
  )
}
