import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showToast } from '../components/Toast'
import hkpgLogo from '../assets/hkpg-logo.png'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation
    if (!form.email.trim()) {
      showToast.error('Email Required', 'Please enter your email address.')
      return
    }
    if (!form.password.trim()) {
      showToast.error('Password Required', 'Please enter your password.')
      return
    }

    setLoading(true)
    const id = showToast.loading('Signing In...', 'Verifying your credentials, please wait.')

    const result = await login(form.email, form.password)
    setLoading(false)

    if (!result.success) {
      showToast.update(id, 'error',
        'Login Failed',
        result.error || 'Invalid email or password. Please try again.'
      )
      return
    }

    showToast.update(id, 'success',
      result.role === 'admin' ? 'Welcome, Admin! 👑' : 'Welcome Back! 👋',
      result.role === 'admin'
        ? 'Redirecting to Admin Dashboard...'
        : 'Redirecting to your Student Dashboard...'
    )

    setTimeout(() => {
      navigate(result.role === 'admin' ? '/admin' : '/student', { replace: true })
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={hkpgLogo} alt="HKPG" className="w-20 h-20 rounded-full border-4 border-pink-200 shadow-lg mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-800">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your HK PG account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-5">

          {/* Info hint — remove in production if desired */}
          {import.meta.env.DEV && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-1">
              <p className="text-xs font-bold text-blue-700">🔐 Dev — Default Admin</p>
              <p className="text-xs text-blue-600">Email: <span className="font-semibold">admin@hkpg.com</span></p>
              <p className="text-xs text-blue-600">Password: <span className="font-semibold">admin123</span></p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
            >
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color: '#c026d3' }}>
              Create Account
            </Link>
          </p>
        </div>

        <p className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
