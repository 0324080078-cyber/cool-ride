import { describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import PaymentsPage from './PaymentsPage'

const queryClient = new QueryClient()

describe('PaymentsPage', () => {
  it('renders heading', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PaymentsPage />
      </QueryClientProvider>,
    )

    expect(screen.getAllByText(/Payments/i)[0]).toBeInTheDocument()
  })
})
