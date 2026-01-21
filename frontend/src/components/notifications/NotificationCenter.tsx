import { useUIStore } from '../../store/uiStore'

const colors = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-slate-500',
}

const NotificationCenter = () => {
  const { notifications, removeNotification } = useUIStore()

  if (!notifications.length) return null

  return (
    <div className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center justify-between rounded px-4 py-3 text-white shadow-lg ${colors[n.type]}`}
        >
          <p className="text-sm">{n.message}</p>
          <button onClick={() => removeNotification(n.id)} className="text-xs underline">
            Close
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationCenter
