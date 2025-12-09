import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaMobileAlt, FaShieldAlt, FaMoneyBillWave } from 'react-icons/fa';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🛺</span>
              <span className="text-2xl font-bold text-blue-600">CoolRides</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600">How It Works</Link>
              <Link to="/become-rider" className="text-gray-700 hover:text-blue-600">Become a Rider</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
              <Link to="/safety" className="text-gray-700 hover:text-blue-600">Safety</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            </div>
            <div className="flex space-x-4">
              <button className="btn-outline">Sign In</button>
              <button className="btn-primary">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Your Reliable Keke Transport Service
              </h1>
              <p className="text-xl mb-8">
                Fast, safe, and affordable Pragia rides across Ho Township. 
                Book your ride in seconds and get where you need to go!
              </p>
              <div className="flex space-x-4">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Book a Ride
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Download App
                </button>
              </div>
              <div className="mt-8 flex space-x-6">
                <div>
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-blue-200">Happy Riders</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">5000+</div>
                  <div className="text-blue-200">Completed Trips</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.8★</div>
                  <div className="text-blue-200">Average Rating</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
                <div className="text-8xl mb-4">🛺</div>
                <p className="text-lg">Download the app to get started!</p>
                <div className="mt-6 space-y-4">
                  <button className="w-full bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2">
                    <span>📱</span>
                    <span>Download on Google Play</span>
                  </button>
                  <button className="w-full bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2">
                    <span>🍎</span>
                    <span>Download on App Store</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose CoolRides?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <FaMapMarkerAlt className="text-5xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Track your Keke rider's location in real-time from pickup to destination
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <FaMobileAlt className="text-5xl text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book your ride with just a few taps on your mobile device
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <FaShieldAlt className="text-5xl text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Safety First</h3>
              <p className="text-gray-600">
                Verified riders, trip sharing, and SOS emergency features
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <FaMoneyBillWave className="text-5xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                See the exact fare before booking. Pay with cash or Mobile Money
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Request a Ride</h3>
              <p className="text-gray-600">
                Enter your pickup and destination locations in the app
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Get Matched</h3>
              <p className="text-gray-600">
                We'll connect you with the nearest available Keke rider
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-yellow-600">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Enjoy Your Ride</h3>
              <p className="text-gray-600">
                Track your ride in real-time and pay easily when you arrive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-blue-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">Simple & Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-5xl mb-4">☀️</div>
              <h3 className="text-2xl font-bold mb-4">Daytime Rates</h3>
              <p className="text-gray-600 mb-4">6:00 AM - 10:00 PM</p>
              <div className="text-4xl font-bold text-blue-600 mb-2">GHS 3</div>
              <p className="text-gray-600">Base fare + distance & time charges</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-5xl mb-4">🌙</div>
              <h3 className="text-2xl font-bold mb-4">Night Rates</h3>
              <p className="text-gray-600 mb-4">10:00 PM - 3:00 AM</p>
              <div className="text-4xl font-bold text-blue-600 mb-2">GHS 15-20</div>
              <p className="text-gray-600">Flat rate based on distance & demand</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="btn-primary">View Full Pricing Details</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Want to Drive with CoolRides?</h2>
          <p className="text-xl mb-8">
            Join our community of riders and start earning today!
          </p>
          <Link to="/become-rider" className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Become a Rider
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">🛺</span>
                <span className="text-2xl font-bold">CoolRides</span>
              </div>
              <p className="text-gray-400">
                Your reliable Keke transport service in Ho Township, Ghana
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="text-gray-400 hover:text-white">How It Works</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="/safety" className="text-gray-400 hover:text-white">Safety</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">For Riders</h4>
              <ul className="space-y-2">
                <li><Link to="/become-rider" className="text-gray-400 hover:text-white">Become a Rider</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-white">Rider Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Ho Township, Ghana</li>
                <li className="text-gray-400">support@coolrides.com</li>
                <li className="text-gray-400">+233 XX XXX XXXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CoolRides. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
