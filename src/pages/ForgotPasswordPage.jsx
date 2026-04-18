import { useState } from 'react'
import { Link } from 'react-router-dom'
import { showToast } from '../components/Toast'
import { authApi } from '../services/api'
import hkpgLogo from '../assets/hkpg-logo.png'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      showToast.error('Invalid Email', 'Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      await authApi.forgotPassword(email.trim().toLowerCase())
      setSent(true)
      showToast.success('Email Sent', 'Check your inbox for reset instructions.')
    } catch (err) {
      showToast.error('Failed', err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputBase = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition bg-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100'

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #fdf3e7 60%, #fff8f0 100%)' }}>
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <img src={hkpgLogo} alt="HK PG" className="w-16 h-16 rounded-full border-4 border-pink-200 shadow-lg mb-4" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {!sent ? (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-gray-900">Forgot password?</h1>
                <p className="text-gray-500 text-sm mt-2">
                  Enter your registered email and we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputBase}
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-extrabold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg active:scale-95 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #d63384, #c026d3)' }}
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending...
                      </span>
                    : 'Send Reset Link →'
                  }
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                  fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-xs text-gray-400">
                Didn't receive it?{' '}
                <button onClick={() => setSent(false)} className="font-bold hover:underline" style={{ color: '#c026d3' }}>
                  Try again
                </button>
              </p>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <Link to="/login" className="text-sm font-semibold hover:underline transition" style={{ color: '#c026d3' }}>
              ← Back to Sign In
            </Link>
          </div>
        </div>

        <p className="text-center mt-5">
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
