import { createContext, useContext, useState, useEffect } from 'react'
import { authApi, getToken, setToken, removeToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    const token      = getToken()
    const storedUser = (() => {
      try { return JSON.parse(localStorage.getItem('hkpg_user')) }
      catch { return null }
    })()

    // No token or no stored user → show Login + Sign Up
    if (!token || !storedUser) {
      setUser(null)
      setValidating(false)
      return
    }

    // Token exists → validate with backend
    authApi.getMe()
      .then(res => {
        const d = res?.data
        if (!d?.id) { clearSession(); return }
        const fresh = buildUser(d, storedUser)
        setUser(fresh)
        localStorage.setItem('hkpg_user', JSON.stringify(fresh))
      })
      .catch(() => clearSession())
      .finally(() => setValidating(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const buildUser = (serverData, fallback = {}) => ({
    id:              serverData.id              ?? fallback.id,
    name:            serverData.name            || fallback.name  || 'User',
    email:           serverData.email           || fallback.email || '',
    role:            (serverData.role           || fallback.role  || 'student').toLowerCase(),
    phone:           serverData.phone           ?? fallback.phone ?? '',
    profilePhotoUrl: serverData.profilePhotoUrl ?? fallback.profilePhotoUrl ?? '',
  })

  const clearSession = () => {
    setUser(null)
    removeToken()
    localStorage.removeItem('hkpg_user')
  }

  const saveUser = (userData) => {
    setUser(userData)
    localStorage.setItem('hkpg_user', JSON.stringify(userData))
  }

  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password)
      const { token, ...userData } = res.data
      setToken(token)
      const u = buildUser(userData)
      saveUser(u)
      return { success: true, role: u.role }
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password' }
    }
  }

  const register = async (name, email, password, phone = '') => {
    try {
      const res = await authApi.register(name, email, password, phone)
      const { token, ...userData } = res.data
      setToken(token)
      const u = buildUser(userData)
      saveUser(u)
      return { success: true, role: 'student' }
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' }
    }
  }

  const updateProfile = async (data) => {
    try {
      const res = await authApi.updateProfile(data)
      const fresh = buildUser(res.data, user)
      saveUser(fresh)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Update failed' }
    }
  }

  const uploadPhoto = async (file) => {
    try {
      const res = await authApi.uploadPhoto(file)
      const fresh = buildUser(res.data, user)
      saveUser(fresh)
      return { success: true, url: fresh.profilePhotoUrl }
    } catch (err) {
      return { success: false, error: err.message || 'Upload failed' }
    }
  }

  const logout = () => clearSession()

  // Show spinner while validating token — prevents flash of wrong state
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, uploadPhoto }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
