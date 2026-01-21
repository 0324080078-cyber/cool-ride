export interface LocationPoint {
  lat: number
  lng: number
}

export interface Ride {
  id: string
  pickup: string
  dropoff: string
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  fare: number
  passengerId: string
  driverId?: string
}
