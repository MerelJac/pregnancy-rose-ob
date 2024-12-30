import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Footer from './components/Footer';
import Diet from './pages/Diet';
import Recipes from './pages/Recipes';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
