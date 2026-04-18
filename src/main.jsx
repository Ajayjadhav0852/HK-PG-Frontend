import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { startKeepAlive } from './services/api.js'

const GOOGLE_CLIENT_ID = '87232370070-giptjv43leuec5tief2bvlr6v1kf937s.apps.googleusercontent.com'

// ── Session version guard ─────────────────────────────────────────────────────
// Bump SESSION_VERSION any time you want to force-clear all stored sessions.
// This runs before React mounts — guarantees no stale user shown at startup.
const SESSION_VERSION = 'hkpg-session-v6'

if (sessionStorage.getItem('__hkpg_tab_init') !== SESSION_VERSION) {
  // First load of this tab (new tab, fresh browser, hard refresh)
  // Clear any stale localStorage session
  localStorage.removeItem('hkpg_user')
  localStorage.removeItem('hkpg_token')
  // Mark this tab as initialized so refreshes within the same tab keep the session
  sessionStorage.setItem('__hkpg_tab_init', SESSION_VERSION)
}

// ── Keep Render backend alive ─────────────────────────────────────────────────
// Pings /health every 10 min so the free-tier server never cold-starts.
startKeepAlive()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
