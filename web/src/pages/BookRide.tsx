import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tripService } from '../services/api';
import { toast } from 'react-toastify';

interface Location {
  name: string;
  coordinates: [number, number]; // [lng, lat]
}

// Popular locations in Ho, Ghana
const POPULAR_LOCATIONS: Location[] = [
  { name: 'Ho Central Market', coordinates: [0.4700, 6.6119] },
  { name: 'Ho Technical University', coordinates: [0.4850, 6.6200] },
  { name: 'Ho Teaching Hospital', coordinates: [0.4650, 6.6050] },
  { name: 'Ho Municipal Assembly', coordinates: [0.4720, 6.6140] },
  { name: 'Barclays Bank Ho', coordinates: [0.4710, 6.6125] },
  { name: 'Ho Stadium', coordinates: [0.4780, 6.6180] },
  { name: 'Tsito Junction', coordinates: [0.5100, 6.6500] },
  { name: 'Sokode', coordinates: [0.5200, 6.6800] },
];

const BookRide: React.FC = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null);
  const [estimate, setEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book a ride');
      navigate('/login');
    }
  }, [navigate]);

  const handlePickupSelect = (location: Location) => {
    setPickup(location.name);
    setPickupCoords(location.coordinates);
  };

  const handleDropoffSelect = (location: Location) => {
    setDropoff(location.name);
    setDropoffCoords(location.coordinates);
  };

  const calculateDistance = (coords1: [number, number], coords2: [number, number]): number => {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = ((coords2[1] - coords1[1]) * Math.PI) / 180;
    const dLon = ((coords2[0] - coords1[0]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coords1[1] * Math.PI) / 180) *
        Math.cos((coords2[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleGetEstimate = async () => {
    if (!pickupCoords || !dropoffCoords) {
      toast.error('Please select both pickup and dropoff locations');
      return;
    }

    setLoading(true);

    try {
      const response = await tripService.getEstimate({
        pickupLocation: { lat: pickupCoords[1], lng: pickupCoords[0] },
        dropoffLocation: { lat: dropoffCoords[1], lng: dropoffCoords[0] },
      });

      setEstimate(response.data);
    } catch (error: any) {
      // Fallback estimation if backend fails
      const distance = calculateDistance(pickupCoords, dropoffCoords);
      const baseFare = 3;
      const perKm = 2;
      const estimatedFare = baseFare + distance * perKm;
      const estimatedTime = Math.ceil((distance / 30) * 60); // Assuming 30 km/h average speed

      setEstimate({
        fare: estimatedFare.toFixed(2),
        distance: distance.toFixed(2),
        estimatedTime,
        currency: 'GHS',
      });

      console.error('Estimation error, using fallback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async () => {
    if (!pickupCoords || !dropoffCoords || !estimate) {
      toast.error('Please get a fare estimate first');
      return;
    }

    setBooking(true);

    try {
      const response = await tripService.createTrip({
        pickupLocation: {
          address: pickup,
          coordinates: { lat: pickupCoords[1], lng: pickupCoords[0] },
        },
        dropoffLocation: {
          address: dropoff,
          coordinates: { lat: dropoffCoords[1], lng: dropoffCoords[0] },
        },
        paymentMethod: 'cash',
      });

      toast.success('Ride booked successfully! Finding nearby riders...');
      navigate(`/active-trip/${response.data.trip.id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to book ride. Please try again.';
      toast.error(message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-3xl">🛺</span>
              <span className="text-2xl font-bold text-blue-600">CoolRides</span>
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Booking Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Book a Ride 🚖</h1>

        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Pickup Location */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              📍 Pickup Location
            </label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter or select pickup location"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {POPULAR_LOCATIONS.map((location) => (
                <button
                  key={location.name}
                  onClick={() => handlePickupSelect(location)}
                  className="px-3 py-2 bg-gray-100 hover:bg-blue-100 text-sm rounded-lg border border-gray-300 transition-colors"
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dropoff Location */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              🎯 Dropoff Location
            </label>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Enter or select dropoff location"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {POPULAR_LOCATIONS.map((location) => (
                <button
                  key={location.name}
                  onClick={() => handleDropoffSelect(location)}
                  className="px-3 py-2 bg-gray-100 hover:bg-green-100 text-sm rounded-lg border border-gray-300 transition-colors"
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>

          {/* Get Estimate Button */}
          <button
            onClick={handleGetEstimate}
            disabled={loading || !pickup || !dropoff}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 mb-6"
          >
            {loading ? 'Calculating...' : 'Get Fare Estimate'}
          </button>

          {/* Estimate Display */}
          {estimate && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Estimate</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {estimate.currency} {estimate.fare}
                  </div>
                  <div className="text-gray-600">Estimated Fare</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{estimate.distance} km</div>
                  <div className="text-gray-600">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{estimate.estimatedTime} min</div>
                  <div className="text-gray-600">Estimated Time</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 text-center">
                💰 Payment Method: Cash on Delivery
              </div>
            </div>
          )}

          {/* Book Ride Button */}
          {estimate && (
            <button
              onClick={handleBookRide}
              disabled={booking}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300 text-lg"
            >
              {booking ? 'Booking...' : '🚖 Book Ride Now'}
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-blue-800">
            <strong>Note:</strong> Mapbox integration can be added later for interactive map selection. 
            For now, select from popular locations or type your address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookRide;
