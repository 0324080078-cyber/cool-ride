import { Link, NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: ['passenger', 'rider', 'admin'] },
  { to: '/trips', label: 'Trips', roles: ['passenger', 'rider'] },
  { to: '/requests', label: 'Ride Requests', roles: ['passenger'] },
  { to: '/vehicles', label: 'Vehicles', roles: ['rider'] },
  { to: '/payments', label: 'Payments', roles: ['passenger', 'rider'] },
  { to: '/admin/drivers', label: 'Drivers', roles: ['admin'] },
  { to: '/admin/users', label: 'Users', roles: ['admin'] },
  { to: '/settings', label: 'Settings', roles: ['passenger', 'rider', 'admin'] },
]

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold">
            CoolRides
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {navItems
              .filter((item) => (user ? item.roles.includes(user.role) : false))
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded px-3 py-2 ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            {user ? (
              <button
                onClick={logout}
                className="rounded bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}

export default AppLayout
