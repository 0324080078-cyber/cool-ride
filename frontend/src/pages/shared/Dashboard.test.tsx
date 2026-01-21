import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Dashboard from './Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'

describe('Dashboard', () => {
  it('renders headline', () => {
    useAuthStore.setState({ user: { id: '1', name: 'Test', email: '', role: 'passenger', token: 't' }, isAuthenticated: true })
    const qc = new QueryClient()
    render(
      <QueryClientProvider client={qc}>
        <Dashboard />
      </QueryClientProvider>,
    )
    expect(screen.getByText(/Active trips/i)).toBeInTheDocument()
  })
})
