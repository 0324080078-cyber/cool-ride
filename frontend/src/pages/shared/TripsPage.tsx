import TripList from '../../components/trips/TripList'
import TripMap from '../../components/trips/TripMap'

const TripsPage = () => (
  <div className="grid gap-6 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <TripMap />
    </div>
    <div>
      <TripList />
    </div>
  </div>
)

export default TripsPage
