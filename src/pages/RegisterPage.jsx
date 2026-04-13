import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showToast } from '../components/Toast'
import hkpgLogo from '../assets/hkpg-logo.png'

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim() || form.name.trim().length < 2) {
      showToast.error('Name Too Short', 'Full name must be at least 2 characters.')
      return
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      showToast.error('Invalid Email', 'Please enter a valid email address.')
      return
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      showToast.error('Invalid Phone', 'Phone number must be exactly 10 digits.')
      return
    }
    if (form.password.length < 6) {
      showToast.error('Password Too Short', 'Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      showToast.error('Passwords Do Not Match', 'Both password fields must be identical.')
      return
    }

    setLoading(true)
    const id = showToast.loading('Creating Account...', 'Setting up your student profile.')
    const result = await register(form.name.trim(), form.email.trim(), form.password, form.phone.trim())
    setLoading(false)

    if (!result.success) {
      showToast.update(id, 'error', 'Registration Failed', result.error || 'Could not create account.')
      return
    }

    showToast.update(id, 'success', 'Account Created! 🎉', 'Welcome to HK PG!')
    setTimeout(() => navigate('/student', { replace: true }), 800)
  }

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
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input type="text" placeholder="e.g. Rahul Sharma"
                value={form.name} onChange={set('name')} className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={set('email')} className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Mobile Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input type="tel" placeholder="10-digit mobile number" maxLength={10}
                value={form.phone} onChange={set('phone')} className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <input type="password" placeholder="Minimum 6 characters"
                value={form.password} onChange={set('password')} className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input type="password" placeholder="Re-enter your password"
                value={form.confirm} onChange={set('confirm')} className={inputCls} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
              {loading ? '⏳ Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold hover:underline" style={{ color: '#c026d3' }}>Sign In</Link>
          </p>
        </div>

        <p className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
