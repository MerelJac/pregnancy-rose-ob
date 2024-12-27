import React from 'react'
import { BrowserRouter as Link } from 'react-router-dom';
import '../App.css';
import logo from '../rose.png';

function Home() {
  return (
    <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Welcome, Lauren!</p>
          <Link to="/dashboard" className="App-link">
            Let's go.
          </Link>
        </header>
    </div>
  )
}

export default Home
