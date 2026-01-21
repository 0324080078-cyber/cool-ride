import { create } from 'zustand'
import { useEffect } from 'react'
import { authApi } from '../utils/api'
import { storage } from '../utils/storage'

export type Role = 'passenger' | 'rider' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  token: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: Role) => Promise<void>
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    const res = await authApi.post('/auth/login', { email, password })
    const user = res.data as AuthUser
    storage.set('auth', user)
    set({ user, isAuthenticated: true })
  },
  signup: async (name, email, password, role) => {
    const res = await authApi.post('/auth/signup', { name, email, password, role })
    const user = res.data as AuthUser
    storage.set('auth', user)
    set({ user, isAuthenticated: true })
  },
  logout: () => {
    storage.remove('auth')
    set({ user: null, isAuthenticated: false })
  },
  loadFromStorage: () => {
    const stored = storage.get<AuthUser>('auth')
    if (stored?.token) {
      set({ user: stored, isAuthenticated: true })
    }
  },
}))

export const AuthInitializer = () => {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])
  return null
}
