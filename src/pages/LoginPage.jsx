import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import hkpgLogo from '../assets/hkpg-logo.png'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const result = login(form.email, form.password)
      setLoading(false)
      if (!result.success) { setError(result.error); return }
      navigate(result.role === 'admin' ? '/admin' : '/student', { replace: true })
    }, 600)
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

          {/* Demo credentials hint */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 space-y-1">
            <p className="font-bold">Demo credentials:</p>
            <p>🔑 Admin: admin@hkpg.com / admin123</p>
            <p>🎓 Student: rahul@student.com / student123</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
              <input
                type="email" required placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <input
                type="password" required placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color: '#c026d3' }}>
              Sign Up
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
