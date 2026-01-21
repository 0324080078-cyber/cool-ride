import { useQuery } from '@tanstack/react-query'
import { paymentApi } from '../../utils/api'

interface Payment {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  date: string
}

const PaymentsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await paymentApi.get('/payments')
      return res.data as Payment[]
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Payments</h1>
      {isLoading ? (
        <p className="text-slate-400">Loading payments...</p>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-900/70">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data?.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm text-slate-200">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-emerald-400">${p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{p.status}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{p.date}</td>
                </tr>
              ))}
              {!data?.length && (
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-400" colSpan={4}>
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PaymentsPage
