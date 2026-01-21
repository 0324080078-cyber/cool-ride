import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import LandingPage from '../pages/public/LandingPage'
import LoginPage from '../pages/public/LoginPage'
import SignupPage from '../pages/public/SignupPage'
import Dashboard from '../pages/shared/Dashboard'
import TripsPage from '../pages/shared/TripsPage'
import VehiclesPage from '../pages/rider/VehiclesPage'
import RequestsPage from '../pages/passenger/RequestsPage'
import ManageDriversPage from '../pages/admin/ManageDriversPage'
import ManageUsersPage from '../pages/admin/ManageUsersPage'
import PaymentsPage from '../pages/shared/PaymentsPage'
import SettingsPage from '../pages/shared/SettingsPage'
import { ProtectedRoute } from './ProtectedRoute'
import NotFoundPage from '../pages/public/NotFoundPage'

const roleRoute = (allowed: Array<'passenger' | 'rider' | 'admin'>, element: JSX.Element) => (
  <ProtectedRoute allowedRoles={allowed}>{element}</ProtectedRoute>
)

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/dashboard', element: roleRoute(['passenger', 'rider', 'admin'], <Dashboard />) },
      { path: '/trips', element: roleRoute(['passenger', 'rider'], <TripsPage />) },
      { path: '/requests', element: roleRoute(['passenger'], <RequestsPage />) },
      { path: '/vehicles', element: roleRoute(['rider'], <VehiclesPage />) },
      { path: '/payments', element: roleRoute(['passenger', 'rider'], <PaymentsPage />) },
      { path: '/settings', element: roleRoute(['passenger', 'rider', 'admin'], <SettingsPage />) },
      { path: '/admin/drivers', element: roleRoute(['admin'], <ManageDriversPage />) },
      { path: '/admin/users', element: roleRoute(['admin'], <ManageUsersPage />) },
      { path: '*', element: <NotFoundPage /> },
      { path: '/404', element: <NotFoundPage /> },
      { path: '/logout', element: <Navigate to="/login" replace /> },
    ],
  },
])
