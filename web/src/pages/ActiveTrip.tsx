import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tripService } from '../services/api';
import { toast } from 'react-toastify';

interface Trip {
  id: string;
  status: string;
  pickupLocation: { address: string };
  dropoffLocation: { address: string };
  fare: number;
  distance: number;
  rider?: {
    fullName: string;
    phone: string;
    vehicleNumber: string;
  };
}

const ActiveTrip: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (tripId) {
      fetchTripDetails();
      // Poll for updates every 10 seconds
      const interval = setInterval(fetchTripDetails, 10000);
      return () => clearInterval(interval);
    }
  }, [tripId, navigate]);

  const fetchTripDetails = async () => {
    try {
      const response = await tripService.getTripDetails(tripId!);
      setTrip(response.data.trip);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch trip details:', error);
      setLoading(false);
    }
  };

  const handleCancelTrip = async () => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) {
      return;
    }

    try {
      await tripService.cancelTrip(tripId!, 'Passenger cancelled');
      toast.success('Trip cancelled successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel trip');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading trip details...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip Not Found</h2>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { text: string; color: string; icon: string } } = {
      pending: { text: 'Finding Rider...', color: 'yellow', icon: '🔍' },
      accepted: { text: 'Rider Assigned', color: 'blue', icon: '✅' },
      'in-progress': { text: 'Trip In Progress', color: 'green', icon: '🚖' },
      completed: { text: 'Trip Completed', color: 'green', icon: '🎉' },
      cancelled: { text: 'Trip Cancelled', color: 'red', icon: '❌' },
    };
    return statusMap[status] || { text: status, color: 'gray', icon: '📝' };
  };

  const statusInfo = getStatusInfo(trip.status);

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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Header */}
        <div className={`bg-${statusInfo.color}-100 border-l-4 border-${statusInfo.color}-500 p-6 rounded-lg mb-6`}>
          <div className="flex items-center">
            <span className="text-4xl mr-4">{statusInfo.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{statusInfo.text}</h2>
              <p className="text-gray-600">Trip ID: {trip.id.substring(0, 8)}...</p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Details</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">📍</span>
              <div>
                <div className="text-sm text-gray-600">Pickup</div>
                <div className="font-semibold text-gray-800">{trip.pickupLocation.address}</div>
              </div>
            </div>

            <div className="border-l-2 border-gray-300 ml-4 h-8"></div>

            <div className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <div className="text-sm text-gray-600">Dropoff</div>
                <div className="font-semibold text-gray-800">{trip.dropoffLocation.address}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Fare</div>
              <div className="text-2xl font-bold text-green-600">GHS {trip.fare}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Distance</div>
              <div className="text-2xl font-bold text-blue-600">{trip.distance} km</div>
            </div>
          </div>
        </div>

        {/* Rider Information */}
        {trip.rider && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Rider</h3>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <div className="font-bold text-lg text-gray-800">{trip.rider.fullName}</div>
                <div className="text-gray-600">{trip.rider.phone}</div>
                <div className="text-sm text-gray-500">Vehicle: {trip.rider.vehicleNumber}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Actions</h3>
          
          {trip.status === 'pending' && (
            <button
              onClick={handleCancelTrip}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Cancel Trip
            </button>
          )}

          {trip.status === 'completed' && (
            <div className="space-y-3">
              <div className="text-center text-green-600 font-semibold mb-4">
                ✅ Trip Completed Successfully!
              </div>
              <Link
                to="/trip-history"
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                View Trip History
              </Link>
              <Link
                to="/book-ride"
                className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
              >
                Book Another Ride
              </Link>
            </div>
          )}

          {trip.status === 'in-progress' && (
            <div className="text-center">
              <div className="text-green-600 font-semibold mb-4">
                🚖 Enjoy your ride! You'll arrive soon.
              </div>
              <div className="text-gray-600 text-sm">
                Please pay GHS {trip.fare} in cash to your rider
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveTrip;
