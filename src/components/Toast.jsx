import toast, { Toaster } from 'react-hot-toast'

// ── Custom toast renderer with full Tailwind styling ─────────────────────────
const toastStyle = {
  success: {
    icon: '✅',
    bar:  'bg-green-500',
    wrap: 'bg-white border border-green-200 shadow-lg shadow-green-100/50',
    title:'text-green-800',
    msg:  'text-green-600',
  },
  error: {
    icon: '❌',
    bar:  'bg-red-500',
    wrap: 'bg-white border border-red-200 shadow-lg shadow-red-100/50',
    title:'text-red-800',
    msg:  'text-red-600',
  },
  loading: {
    icon: '⏳',
    bar:  'bg-pink-500 animate-pulse',
    wrap: 'bg-white border border-pink-200 shadow-lg shadow-pink-100/50',
    title:'text-pink-800',
    msg:  'text-pink-600',
  },
  info: {
    icon: 'ℹ️',
    bar:  'bg-blue-500',
    wrap: 'bg-white border border-blue-200 shadow-lg shadow-blue-100/50',
    title:'text-blue-800',
    msg:  'text-blue-600',
  },
  warning: {
    icon: '⚠️',
    bar:  'bg-yellow-500',
    wrap: 'bg-white border border-yellow-200 shadow-lg shadow-yellow-100/50',
    title:'text-yellow-800',
    msg:  'text-yellow-600',
  },
}

function ToastCard({ t, type, title, message }) {
  const s = toastStyle[type] || toastStyle.info
  return (
    <div
      className={`
        flex items-start gap-3 w-80 rounded-2xl px-4 py-3 pointer-events-auto
        transition-all duration-300
        ${s.wrap}
        ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
    >
      {/* Left color bar */}
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${s.bar}`} />

      {/* Icon */}
      <span className="text-xl flex-shrink-0 mt-0.5">{s.icon}</span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-tight ${s.title}`}>{title}</p>
        {message && (
          <p className={`text-xs mt-0.5 leading-snug ${s.msg}`}>{message}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition text-lg leading-none mt-0.5"
      >
        ×
      </button>
    </div>
  )
}

// ── Public toast helpers ──────────────────────────────────────────────────────
export const showToast = {
  success: (title, message) =>
    toast.custom(t => <ToastCard t={t} type="success" title={title} message={message} />,
      { duration: 3500 }),

  error: (title, message) =>
    toast.custom(t => <ToastCard t={t} type="error" title={title} message={message} />,
      { duration: 5000 }),

  loading: (title, message) =>
    toast.custom(t => <ToastCard t={t} type="loading" title={title} message={message} />,
      { duration: Infinity }),

  info: (title, message) =>
    toast.custom(t => <ToastCard t={t} type="info" title={title} message={message} />,
      { duration: 3500 }),

  warning: (title, message) =>
    toast.custom(t => <ToastCard t={t} type="warning" title={title} message={message} />,
      { duration: 4000 }),

  // Update an existing loading toast
  update: (id, type, title, message) => {
    toast.custom(t => <ToastCard t={{ ...t, id }} type={type} title={title} message={message} />,
      { id, duration: type === 'loading' ? Infinity : type === 'error' ? 5000 : 3500 })
  },

  dismiss: (id) => toast.dismiss(id),
}

// ── Toaster container ─────────────────────────────────────────────────────────
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      containerStyle={{ top: 20, right: 20 }}
      toastOptions={{ style: { background: 'transparent', boxShadow: 'none', padding: 0 } }}
    />
  )
}
