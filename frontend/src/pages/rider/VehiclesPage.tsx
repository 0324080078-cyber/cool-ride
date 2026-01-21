import { useQuery } from '@tanstack/react-query'
import { ridesApi } from '../../utils/api'
import { useUIStore } from '../../store/uiStore'

interface Vehicle {
  id: string
  plate: string
  model: string
  status: 'active' | 'inactive'
}

const VehiclesPage = () => {
  const addNotification = useUIStore((s) => s.addNotification)
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await ridesApi.get('/vehicles')
      return res.data as Vehicle[]
    },
  })

  const toggle = (vehicle: Vehicle) => {
    addNotification(`Set ${vehicle.plate} to ${vehicle.status === 'active' ? 'inactive' : 'active'} (mock)`, 'info')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Vehicles</h1>
      {isLoading ? (
        <p className="text-slate-400">Loading vehicles...</p>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-900/70">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Plate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Model</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data?.map((v) => (
                <tr key={v.id}>
                  <td className="px-4 py-3 text-sm text-slate-200">{v.plate}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{v.model}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{v.status}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">
                    <button
                      onClick={() => toggle(v)}
                      className="rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-500"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
              {!data?.length && (
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-400" colSpan={4}>
                    No vehicles found
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

export default VehiclesPage
