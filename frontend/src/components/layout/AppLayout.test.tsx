import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AppLayout from './AppLayout'
import { useAuthStore } from '../../store/authStore'

describe('AppLayout', () => {
  it('renders header', () => {
    useAuthStore.setState({
      user: { id: '1', name: 'Test', email: 't@test.com', role: 'passenger', token: 'token' },
      isAuthenticated: true,
    })
    render(
      <MemoryRouter>
        <AppLayout>
          <div>child</div>
        </AppLayout>
      </MemoryRouter>,
    )
    expect(screen.getByText(/CoolRides/i)).toBeInTheDocument()
  })
})
