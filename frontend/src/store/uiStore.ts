import { create } from 'zustand'

interface UIState {
  notifications: { id: string; message: string; type: 'success' | 'error' | 'info' }[]
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  notifications: [],
  addNotification: (message, type = 'info') =>
    set((state) => ({
      notifications: [...state.notifications, { id: crypto.randomUUID(), message, type }],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
