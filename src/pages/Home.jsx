import React from 'react'
import '../App.css';
import logo from '../rose.png';

function Home() {
  return (
    <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Welcome, Lauren!</p>
        </header>
    </div>
  )
}

export default Home
