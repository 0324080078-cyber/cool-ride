import { useQuery } from '@tanstack/react-query'
import { ridesApi } from '../../utils/api'
import { useAuthStore } from '../../store/authStore'

interface Trip {
  id: string
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  pickup: string
  dropoff: string
  fare: number
}

const TripList = () => {
  const { user } = useAuthStore()
  const { data, isLoading } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: async () => {
      const res = await ridesApi.get('/rides')
      return res.data as Trip[]
    },
    enabled: !!user,
  })

  if (isLoading) return <p className="text-slate-400">Loading trips...</p>

  return (
    <div className="flex flex-col gap-2">
      {data?.map((trip) => (
        <div key={trip.id} className="rounded border border-slate-800 bg-slate-900/70 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-300">
              {trip.pickup} → {trip.dropoff}
            </p>
            <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase text-slate-200">{trip.status}</span>
          </div>
          <p className="text-sm text-emerald-400">Fare: ${trip.fare.toFixed(2)}</p>
        </div>
      ))}
      {!data?.length && <p className="text-slate-500">No trips yet.</p>}
    </div>
  )
}

export default TripList
