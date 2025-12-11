import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { toast } from 'react-toastify';

interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  userType: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        fullName: userData.fullName || '',
        phone: userData.phone || '',
        email: userData.email || '',
      });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userService.updateProfile(formData);
      const updatedUser = response.data.user;
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('You have been logged out');
    navigate('/');
  };

  if (!user) {
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
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile 👤</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 text-5xl">
                👤
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{user.fullName}</h2>
              <p className="text-gray-600 mb-2">{user.phone}</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {user.userType === 'passenger' ? '🚶 Passenger' : '🚖 Rider'}
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-800 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <div className="text-sm text-gray-600 mb-1">Full Name</div>
                    <div className="text-lg font-semibold text-gray-800">{user.fullName}</div>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <div className="text-sm text-gray-600 mb-1">Phone Number</div>
                    <div className="text-lg font-semibold text-gray-800">{user.phone}</div>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <div className="text-sm text-gray-600 mb-1">Email</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {user.email || 'Not provided'}
                    </div>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <div className="text-sm text-gray-600 mb-1">Account Type</div>
                    <div className="text-lg font-semibold text-gray-800 capitalize">
                      {user.userType}
                    </div>
                  </div>
                  <div className="pb-4">
                    <div className="text-sm text-gray-600 mb-1">Member Since</div>
                    <div className="text-lg font-semibold text-gray-800">December 2024</div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Settings</h3>
              <div className="space-y-3">
                <Link
                  to="/change-password"
                  className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Change Password</span>
                    <span>→</span>
                  </div>
                </Link>
                <Link
                  to="/payment-methods"
                  className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Payment Methods</span>
                    <span>→</span>
                  </div>
                </Link>
                <Link
                  to="/notifications"
                  className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Notifications</span>
                    <span>→</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
