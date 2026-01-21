import { useNavigate, useLocation, Link } from 'react-router-dom'
import AuthForm, { AuthFormValues } from '../../components/forms/AuthForm'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'

const LoginPage = () => {
  const login = useAuthStore((s) => s.login)
  const addNotification = useUIStore((s) => s.addNotification)
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (values: AuthFormValues) => {
    try {
      await login(values.email, values.password)
      addNotification('Logged in successfully', 'success')
      const target = (location.state as { from?: Location } | undefined)?.from?.pathname || '/dashboard'
      navigate(target, { replace: true })
    } catch {
      addNotification('Login failed', 'error')
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <AuthForm mode="login" onSubmit={onSubmit} />
      <p className="text-sm text-slate-300">
        No account?{' '}
        <Link className="text-indigo-400 underline" to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
