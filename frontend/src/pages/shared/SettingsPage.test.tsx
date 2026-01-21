import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useAuthStore } from '../../store/authStore'
import SettingsPage from './SettingsPage'

describe('SettingsPage', () => {
  it('renders title', () => {
    useAuthStore.setState({
      user: { id: '1', name: 'Test', email: 't@test.com', role: 'passenger', token: 'token' },
      isAuthenticated: true,
    })
    render(<SettingsPage />)
    expect(screen.getByText(/Settings/i)).toBeInTheDocument()
  })
})
