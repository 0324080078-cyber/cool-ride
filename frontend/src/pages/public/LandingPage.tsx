import { Link } from 'react-router-dom'
import PricingEstimator from '../../components/forms/PricingEstimator'

const LandingPage = () => (
  <div className="space-y-8">
    <section className="rounded-lg border border-slate-800 bg-gradient-to-br from-indigo-900 to-slate-900 p-8 shadow-lg">
      <p className="text-sm uppercase tracking-wide text-indigo-200">CoolRides</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Ride sharing, reimagined</h1>
      <p className="mt-2 max-w-2xl text-slate-200">
        Book rides, manage fleets, track drivers, and monitor payments in one secure dashboard. Built for passengers,
        drivers, and admins.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/signup" className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
          Get started
        </Link>
        <Link to="/login" className="rounded border border-indigo-400 px-4 py-2 text-indigo-200 hover:bg-indigo-950">
          Log in
        </Link>
      </div>
    </section>

    <section className="grid gap-6 md:grid-cols-2">
      <PricingEstimator />
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold text-white">Real-time operations</h3>
        <p className="mt-2 text-sm text-slate-300">
          WebSocket-ready frontend to stream ride updates, driver locations, and dispatch events. Swap in Google
          Maps/Mapbox by replacing the map hook.
        </p>
      </div>
    </section>
  </div>
)

export default LandingPage
