import StatCard from '../../components/cards/StatCard'
import TripMap from '../../components/trips/TripMap'
import TripList from '../../components/trips/TripList'

const Dashboard = () => (
  <div className="grid gap-6 lg:grid-cols-3">
    <div className="lg:col-span-2 space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Active trips" value="3" description="live rides in progress" />
        <StatCard title="Drivers online" value="12" description="fleet ready to accept" />
        <StatCard title="Avg ETA" value="4m" description="across service area" />
      </div>
      <TripMap />
    </div>
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Recent trips</h2>
      <TripList />
    </div>
  </div>
)

export default Dashboard
