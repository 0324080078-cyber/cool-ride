import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['passenger', 'rider', 'admin']).optional(),
})

export type AuthFormValues = z.infer<typeof schema>

interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (values: AuthFormValues) => Promise<void>
}

const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({ resolver: zodResolver(schema) })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/70 p-6 shadow"
    >
      <h2 className="text-xl font-semibold text-white">{mode === 'login' ? 'Login' : 'Create account'}</h2>
      {mode === 'signup' && (
        <>
          <div>
            <label className="text-sm text-slate-300" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm text-slate-300" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              {...register('role', { required: mode === 'signup' })}
            >
              <option value="passenger">Passenger</option>
              <option value="rider">Driver</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-xs text-rose-400">{errors.role.message}</p>}
          </div>
        </>
      )}
      <div>
        <label className="text-sm text-slate-300" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          type="email"
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-sm text-slate-300" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="mt-1 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          type="password"
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting...' : mode === 'login' ? 'Login' : 'Create account'}
      </button>
    </form>
  )
}

export default AuthForm
