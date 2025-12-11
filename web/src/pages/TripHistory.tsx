import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';

interface Trip {
  id: string;
  status: string;
  pickupLocation: { address: string };
  dropoffLocation: { address: string };
  fare: number;
  distance: number;
  createdAt: string;
  completedAt?: string;
}

const TripHistory: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch trip history
    // For now, using empty array as placeholder
    // In production, call: tripService.getTripHistory()
    setTrips([]);
    setLoading(false);
  }, [navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badgeClasses: { [key: string]: string } = {
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
    };
    return badgeClasses[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading trips...</div>
      </div>
    );
  }

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
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Trip History 📋</h1>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{trips.length}</div>
            <div className="text-gray-600">Total Trips</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              GHS {trips.reduce((sum, trip) => sum + (trip.fare || 0), 0).toFixed(2)}
            </div>
            <div className="text-gray-600">Total Spent</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {trips.filter((trip) => trip.status === 'completed').length}
            </div>
            <div className="text-gray-600">Completed Trips</div>
          </div>
        </div>

        {/* Trips List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {trips.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No trips yet</h2>
              <p className="text-gray-600 mb-6">Start your journey by booking your first ride!</p>
              <Link
                to="/book-ride"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Your First Ride
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {trips.map((trip) => (
                <div key={trip.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(trip.status)}`}>
                          {trip.status}
                        </span>
                        <span className="text-gray-500 text-sm">{formatDate(trip.createdAt)}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2">📍</span>
                          <span className="text-gray-700">{trip.pickupLocation.address}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-red-600 mr-2">🎯</span>
                          <span className="text-gray-700">{trip.dropoffLocation.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-800">GHS {trip.fare}</div>
                      <div className="text-sm text-gray-500">{trip.distance} km</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Link
                      to={`/active-trip/${trip.id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      View Details →
                    </Link>
                    {trip.status === 'completed' && (
                      <button className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm">
                        ⭐ Rate Trip
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Options (Future Enhancement) */}
        {trips.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Showing all trips. Filters coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripHistory;
