import 'react-router-dom'
import { AuthUser } from '../store/authStore'

declare module 'react-router-dom' {
  export function useOutletContext<T extends { user: AuthUser | null }>(): T
}
