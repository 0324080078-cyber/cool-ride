import { Outlet } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import NotificationCenter from './components/notifications/NotificationCenter'
import { useAuthStore } from './store/authStore'
import { useRealtime } from './hooks/useRealtime'

const App = () => {
  const { user } = useAuthStore()
  useRealtime()

  return (
    <AppLayout>
      <NotificationCenter />
      <Outlet context={{ user }} />
    </AppLayout>
  )
}

export default App
