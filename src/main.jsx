import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
