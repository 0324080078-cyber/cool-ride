import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import BecomeRider from './pages/BecomeRider';
import Pricing from './pages/Pricing';
import Safety from './pages/Safety';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/become-rider" element={<BecomeRider />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
