import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from './LoginPage'
import { useAuthStore } from '../../store/authStore'

const queryClient = new QueryClient()

describe('LoginPage', () => {
  it('submits login form', async () => {
    const loginMock = vi.fn().mockResolvedValue(undefined)
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      login: loginMock,
      signup: async () => {},
      logout: () => {},
      loadFromStorage: () => {},
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@test.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret12' } })
    fireEvent.click(screen.getAllByText(/Login/)[1])

    await waitFor(() => expect(loginMock).toHaveBeenCalled())
  })
})
