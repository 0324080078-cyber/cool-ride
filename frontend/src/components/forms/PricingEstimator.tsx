import { useState } from 'react'
import { pricingApi } from '../../utils/api'

const PricingEstimator = () => {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [estimate, setEstimate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEstimate = async () => {
    if (!pickup || !dropoff) return
    setLoading(true)
    try {
      const res = await pricingApi.post('/pricing/estimate', { pickup, dropoff })
      setEstimate(res.data.amount)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="text-lg font-semibold text-white">Estimate price</h3>
      <div className="mt-3 flex flex-col gap-2">
        <input
          placeholder="Pickup"
          className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <input
          placeholder="Dropoff"
          className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
        />
        <button
          onClick={handleEstimate}
          disabled={loading}
          className="rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? 'Estimating...' : 'Get estimate'}
        </button>
        {estimate !== null && <p className="text-sm text-emerald-400">Estimated: ${estimate.toFixed(2)}</p>}
      </div>
    </div>
  )
}

export default PricingEstimator
