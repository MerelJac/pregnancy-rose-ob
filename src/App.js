import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Footer from './components/Footer';
import Diet from './pages/Diet';

function App() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false); // Hide the welcome message
      navigate('/dashboard'); // Navigate to the dashboard
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [navigate]);

  return (
    <>
      <div className="App">
        {showWelcome ? (
          <div className="App-header">
            <img src="./rose.png" className="App-logo" alt="logo" />
            <p>Welcome, Lauren!</p>
          </div>
        ) : (
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/diet" element={<Diet />} />
            <Route path="*" element={<Home />} />
          </Routes>
        )}
          <Footer/>
      </div>
    </>
  );
}

export default App;
