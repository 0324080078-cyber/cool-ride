import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { toast } from 'react-toastify';

interface User {
  id: string;
  fullName: string;
  phone: string;
  userType: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('You have been logged out');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl">🛺</span>
              <span className="text-2xl font-bold text-blue-600">CoolRides</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hi, {user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.userType === 'passenger' 
              ? 'Ready to book your next ride?'
              : 'Ready to start earning?'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/book-ride"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">🚖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Book a Ride</h3>
            <p className="text-gray-600">Get a ride to your destination quickly and safely</p>
          </Link>

          <Link
            to="/trip-history"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Trip History</h3>
            <p className="text-gray-600">View your past trips and receipts</p>
          </Link>

          <Link
            to="/profile"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">My Profile</h3>
            <p className="text-gray-600">Manage your account settings</p>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Stats</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-gray-600">Total Trips</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">GHS 0</div>
              <div className="text-gray-600">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">0</div>
              <div className="text-gray-600">Active Trips</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-gray-600">Saved Locations</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg">No recent activity</p>
            <p className="text-sm mt-2">Your trips will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
