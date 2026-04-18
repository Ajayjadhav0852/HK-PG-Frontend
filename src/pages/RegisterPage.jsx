import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { showToast } from '../components/Toast'
import hkpgLogo from '../assets/hkpg-logo.png'

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
)

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || form.name.trim().length < 2) { showToast.error('Name Too Short', 'Full name must be at least 2 characters.'); return }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { showToast.error('Invalid Email', 'Please enter a valid email address.'); return }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) { showToast.error('Invalid Phone', 'Phone number must be exactly 10 digits.'); return }
    if (form.password.length < 6) { showToast.error('Password Too Short', 'Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { showToast.error('Passwords Do Not Match', 'Both password fields must be identical.'); return }

    setLoading(true)
    const id = showToast.loading('Creating Account...', 'Setting up your student profile.')
    const result = await register(form.name.trim(), form.email.trim(), form.password, form.phone.trim())
    setLoading(false)

    if (!result.success) { showToast.update(id, 'error', 'Registration Failed', result.error || 'Could not create account.'); return }
    showToast.update(id, 'success', 'Account Created! 🎉', 'Welcome to HK PG!')
    setTimeout(() => navigate('/student', { replace: true }), 800)
  }

  const handleGoogleRegister = () => {
    showToast.info('Coming Soon', 'Google Sign-Up will be available soon.')
  }

  const inputBase = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition bg-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100'

  return (
    <div className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center px-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative text-center">
          <img src={hkpgLogo} alt="HK PG" className="w-24 h-24 rounded-full border-4 border-white/30 shadow-2xl mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-white mb-3">Join HK PG</h2>
          <p className="text-white/80 text-base leading-relaxed mb-8">
            Create your account and start your comfortable living journey with us.
          </p>
          <div className="space-y-3 text-left">
            {['✅ No Brokerage', '🏠 1-4 Sharing Rooms', '🍽️ Home-cooked Food', '📍 Near Railway Station'].map(f => (
              <div key={f} className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-2.5">
                <span className="text-base">{f.split(' ')[0]}</span>
                <span className="text-white/90 text-sm font-medium">{f.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          <div className="flex flex-col items-center mb-6 lg:hidden">
            <img src={hkpgLogo} alt="HK PG" className="w-14 h-14 rounded-full border-4 border-pink-200 shadow-lg mb-2" />
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-extrabold text-gray-900">Create account</h1>
            <p className="text-gray-500 text-sm mt-2">Join HK PG — register as a student</p>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-gray-200 bg-white font-semibold text-gray-700 text-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-95 mb-5"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">or register with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input type="text" placeholder="e.g. Rahul Sharma"
                value={form.name} onChange={set('name')} className={inputBase} autoComplete="name" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={set('email')} className={inputBase} autoComplete="email" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <input type="tel" placeholder="10-digit mobile number" maxLength={10}
                value={form.phone} onChange={set('phone')} className={inputBase} autoComplete="tel" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Minimum 6 characters"
                  value={form.password} onChange={set('password')}
                  className={`${inputBase} pr-12`} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter your password"
                  value={form.confirm} onChange={set('confirm')}
                  className={`${inputBase} pr-12`} autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  tabIndex={-1} aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg active:scale-95 disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}>
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Creating account...
                  </span>
                : 'Create Account →'
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-bold hover:underline" style={{ color: '#c026d3' }}>Sign in</Link>
          </p>

          <p className="text-center mt-4">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
