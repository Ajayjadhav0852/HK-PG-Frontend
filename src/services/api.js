// ─────────────────────────────────────────────────────────────────────────────
// API Client — production-ready fetch wrapper
// Set VITE_API_URL in .env.local (dev) or Vercel env vars (prod)
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = (import.meta.env.VITE_API_URL || 'https://hk-pg-backend.onrender.com').replace(/\/$/, '')

if (!BASE_URL && import.meta.env.DEV) {
  console.warn('[API] VITE_API_URL not set. Add it to .env.local')
}

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken   = ()  => localStorage.getItem('hkpg_token')
export const setToken   = (t) => localStorage.setItem('hkpg_token', t)
export const removeToken = () => localStorage.removeItem('hkpg_token')

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request(path, options = {}, timeoutMs = 60000) {
  if (!BASE_URL) {
    throw new Error('Backend URL not configured. Set VITE_API_URL in environment variables.')
  }

  const token      = getToken()
  const isFormData = options.body instanceof FormData

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token        && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  // Abort controller for timeout
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. The server is taking too long to respond. Please try again.')
    }
    // More helpful error message
    throw new Error('Unable to connect to server. Please check your internet connection and try again.')
  } finally {
    clearTimeout(timer)
  }

  // Handle 401 — token expired, clear session
  if (res.status === 401) {
    removeToken()
    localStorage.removeItem('hkpg_user')
    // Don't redirect here — let AuthContext handle it on next render
  }

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(json.message || `Server error (${res.status})`)
  }

  return json
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (email, password) =>
    request('/api/auth/login',    { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password, phone = '') =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone }) }),
  googleLogin: (token) =>
    request('/api/auth/google',   { method: 'POST', body: JSON.stringify({ token }) }),
  forgotPassword: (email) =>
    request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  getMe:    () => request('/api/users/me'),
  updateProfile: (data) =>
    request('/api/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  uploadPhoto: (file) => {
    const fd = new FormData()
    fd.append('photo', file)
    return request('/api/users/me/photo', { method: 'POST', body: fd }, 30000)
  },
}

// ── Rooms ─────────────────────────────────────────────────────────────────────
export const roomApi = {
  getAll:        ()           => request('/api/room-types'),
  getBySlug:     (slug)       => request(`/api/room-types/${slug}`),
  getAllRooms:    ()           => request('/api/room-types/rooms'),
  getBookedBeds: (roomNumber) => request(`/api/room-types/booked-beds/${roomNumber}`),
}

// ── Applications ──────────────────────────────────────────────────────────────
export const applicationApi = {
  submit:            (fd)  => request('/api/applications', { method: 'POST', body: fd }, 30000),
  getMyApplications: ()    => request('/api/applications/my'),
  getById:           (id)  => request(`/api/applications/${id}`),
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard:            ()                           => request('/api/admin/dashboard'),
  getAllApplications:       ()                           => request('/api/admin/applications'),
  updateApplicationStatus: (id, status, adminNotes = '') =>
    request(`/api/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    }),
  deleteApplication: (id) =>
    request(`/api/admin/applications/${id}`, { method: 'DELETE' }),
  updateRoomType: (slug, data) =>
    request(`/api/admin/room-types/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  changePassword: (passwordData) =>
    request('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    }),
}

// ── Rent Payments ─────────────────────────────────────────────────────────────
export const rentApi = {
  submitPayment: (fd) => request('/api/rent/submit', { method: 'POST', body: fd }, 30000),
  confirmPayment: (token) => request(`/api/rent/confirm/${token}`, { method: 'POST' }),
}

// ── Keep-alive ping ───────────────────────────────────────────────────────────
// Render free tier spins down after 15 min of inactivity.
// Pings /health every 8 minutes — well within the 15-min sleep threshold.
// Also pings immediately on page load to wake the server before user needs it.
export function startKeepAlive() {
  if (typeof window === 'undefined' || !BASE_URL) return

  const ping = () => {
    fetch(`${BASE_URL}/health`, { method: 'GET' })
      .then(() => console.debug('[keep-alive] ping ok'))
      .catch(() => {}) // silent — don't bother the user
  }

  // Ping immediately on page load — wakes server right away
  ping()

  // Then ping every 8 minutes (Render sleeps after 15 min — 8 min is safe margin)
  const interval = setInterval(ping, 8 * 60 * 1000)

  // Return cleanup in case it's ever needed
  return () => { clearInterval(interval) }
}
