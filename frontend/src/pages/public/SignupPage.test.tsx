import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import SignupPage from './SignupPage'
import { useAuthStore } from '../../store/authStore'

const queryClient = new QueryClient()

describe('SignupPage', () => {
  it('submits signup form', async () => {
    const signupMock = vi.fn().mockResolvedValue(undefined)
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      login: async () => {},
      signup: signupMock,
      logout: () => {},
      loadFromStorage: () => {},
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@test.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret12' } })
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'passenger' } })
    fireEvent.click(screen.getAllByText(/Create account/)[1])

    await waitFor(() => expect(signupMock).toHaveBeenCalled())
  })
})
