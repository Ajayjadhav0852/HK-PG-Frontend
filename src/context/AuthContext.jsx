import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Mock users DB — in production replace with real API calls
const MOCK_USERS = [
  { id: 1, name: 'Admin User',   email: 'admin@hkpg.com',   password: 'admin123',   role: 'admin' },
  { id: 2, name: 'Rahul Sharma', email: 'rahul@student.com', password: 'student123', role: 'student' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hkpg_user')) || null }
    catch { return null }
  })

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, error: 'Invalid email or password' }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('hkpg_user', JSON.stringify(safeUser))
    return { success: true, role: safeUser.role }
  }

  const register = (name, email, password) => {
    const exists = MOCK_USERS.find(u => u.email === email)
    if (exists) return { success: false, error: 'Email already registered' }
    const newUser = { id: Date.now(), name, email, role: 'student' }
    MOCK_USERS.push({ ...newUser, password })
    setUser(newUser)
    localStorage.setItem('hkpg_user', JSON.stringify(newUser))
    return { success: true, role: 'student' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hkpg_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
