import { Link, useNavigate } from 'react-router-dom'
import AuthForm, { AuthFormValues } from '../../components/forms/AuthForm'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'

const SignupPage = () => {
  const signup = useAuthStore((s) => s.signup)
  const addNotification = useUIStore((s) => s.addNotification)
  const navigate = useNavigate()

  const onSubmit = async (values: AuthFormValues) => {
    try {
      await signup(values.name ?? '', values.email, values.password, values.role || 'passenger')
      addNotification('Account created', 'success')
      navigate('/dashboard')
    } catch {
      addNotification('Signup failed', 'error')
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <AuthForm mode="signup" onSubmit={onSubmit} />
      <p className="text-sm text-slate-300">
        Already have an account?{' '}
        <Link className="text-indigo-400 underline" to="/login">
          Login
        </Link>
      </p>
    </div>
  )
}

export default SignupPage
