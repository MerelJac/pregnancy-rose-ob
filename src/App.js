import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    // fetch('http://localhost:5001/api/data')
    fetch('https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/api/data')
      .then((res) => {
        console.log('Response:', res);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => console.log('Data:', data))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
