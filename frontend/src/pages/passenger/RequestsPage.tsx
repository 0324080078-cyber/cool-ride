import { RideRequestForm, RideRequestValues } from '../../components/forms/RideRequestForm'
import { ridesApi } from '../../utils/api'
import { useUIStore } from '../../store/uiStore'

const RequestsPage = () => {
  const addNotification = useUIStore((s) => s.addNotification)

  const onSubmit = async (values: RideRequestValues) => {
    try {
      await ridesApi.post('/rides', values)
      addNotification('Ride requested', 'success')
    } catch {
      addNotification('Ride request failed', 'error')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Request a ride</h1>
      <RideRequestForm onSubmit={onSubmit} />
    </div>
  )
}

export default RequestsPage
