import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import BecomeRider from './pages/BecomeRider';
import Pricing from './pages/Pricing';
import Safety from './pages/Safety';
import Contact from './pages/Contact';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import BookRide from './pages/BookRide';
import ActiveTrip from './pages/ActiveTrip';
import TripHistory from './pages/TripHistory';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/become-rider" element={<BecomeRider />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-ride" element={<BookRide />} />
          <Route path="/active-trip/:tripId" element={<ActiveTrip />} />
          <Route path="/trip-history" element={<TripHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        
        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
