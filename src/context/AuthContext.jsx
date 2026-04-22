import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, getToken, setToken, removeToken } from '../services/api'

const AuthContext = createContext(null)

// ✅ moved outside → no re-creation
const buildUser = (serverData, fallback = {}) => ({
  id:              serverData.id              ?? fallback.id,
  name:            serverData.name            || fallback.name  || 'User',
  email:           serverData.email           || fallback.email || '',
  role:            (serverData.role           || fallback.role  || 'student').toLowerCase(),
  phone:           serverData.phone           ?? fallback.phone ?? '',
  profilePhotoUrl: serverData.profilePhotoUrl ?? fallback.profilePhotoUrl ?? '',
})

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null)
  const [validating, setValidating] = useState(true)

  // ✅ stable clear session
  const clearSession = useCallback(() => {
    setUser(null)
    removeToken()
    localStorage.removeItem('hkpg_user')
  }, [])

  // ✅ stable save user
  const saveUser = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('hkpg_user', JSON.stringify(userData))
  }, [])

  useEffect(() => {
    const token = getToken()

    let storedUser = null
    try {
      storedUser = JSON.parse(localStorage.getItem('hkpg_user'))
    } catch {
      storedUser = null
    }

    if (!token) {
      setUser(null)
      setValidating(false)
      return
    }

    // Always validate against the server — never trust localStorage role alone
    authApi.getMe()
      .then(res => {
        const d = res?.data
        if (!d?.id) {
          clearSession()
          return
        }
        // Server response is the source of truth for role — never use localStorage role
        const fresh = buildUser(d, storedUser)
        // Ensure role always comes from server, not localStorage
        fresh.role = (d.role || 'student').toLowerCase()
        setUser(fresh)
        localStorage.setItem('hkpg_user', JSON.stringify(fresh))
      })
      .catch(() => clearSession())
      .finally(() => setValidating(false))
  }, [clearSession])

  const login = useCallback(async (email, password) => {
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
  }, [saveUser])

  const googleLogin = useCallback(async (googleToken) => {
    try {
      const res = await authApi.googleLogin(googleToken)
      const { token, ...userData } = res.data
      setToken(token)
      const u = buildUser(userData)
      saveUser(u)
      return { success: true, role: u.role }
    } catch (err) {
      return { success: false, error: err.message || 'Google login failed' }
    }
  }, [saveUser])

  const register = useCallback(async (name, email, password, phone = '') => {
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
  }, [saveUser])

  const updateProfile = useCallback(async (data) => {
    try {
      const res = await authApi.updateProfile(data)
      const fresh = buildUser(res.data, user)

      saveUser(fresh)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Update failed' }
    }
  }, [user, saveUser])

  const uploadPhoto = useCallback(async (file) => {
    try {
      const res = await authApi.uploadPhoto(file)
      const fresh = buildUser(res.data, user)

      saveUser(fresh)
      return { success: true, url: fresh.profilePhotoUrl }
    } catch (err) {
      return { success: false, error: err.message || 'Upload failed' }
    }
  }, [user, saveUser])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  // ✅ Prevent UI flicker
  if (validating) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg,#fff0f6 0%,#fdf3e7 60%,#fff8f0 100%)',
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{ user, login, googleLogin, register, logout, updateProfile, uploadPhoto }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}