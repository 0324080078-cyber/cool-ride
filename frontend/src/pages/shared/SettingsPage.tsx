import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'

const SettingsPage = () => {
  const { user } = useAuthStore()
  const addNotification = useUIStore((s) => s.addNotification)

  const handleSave = () => {
    addNotification('Settings saved (mock)', 'success')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Settings</h1>
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-sm text-slate-300">Name</p>
        <p className="text-lg text-white">{user?.name}</p>
        <p className="mt-2 text-sm text-slate-300">Role</p>
        <p className="text-lg text-white">{user?.role}</p>
        <button onClick={handleSave} className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
          Save changes
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
