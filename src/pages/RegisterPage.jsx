import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import hkpgLogo from '../assets/hkpg-logo.png'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setTimeout(() => {
      const result = register(form.name, form.email, form.password)
      setLoading(false)
      if (!result.success) { setError(result.error); return }
      navigate('/student', { replace: true })
    }, 600)
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <img src={hkpgLogo} alt="HKPG" className="w-20 h-20 rounded-full border-4 border-pink-200 shadow-lg mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-800">Create Account</h1>
          <p className="text-gray-400 text-sm mt-1">Join HK PG — register as a student</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',     label: 'Full Name',       type: 'text',     placeholder: 'Rahul Sharma' },
              { key: 'email',    label: 'Email Address',   type: 'email',    placeholder: 'you@example.com' },
              { key: 'password', label: 'Password',        type: 'password', placeholder: 'Min 6 characters' },
              { key: 'confirm',  label: 'Confirm Password',type: 'password', placeholder: 'Repeat password' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                <input
                  type={f.type} required placeholder={f.placeholder}
                  value={form[f.key]} onChange={set(f.key)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
                />
              </div>
            ))}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold hover:underline" style={{ color: '#c026d3' }}>
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
