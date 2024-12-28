const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const { getDbConfig } = require('./dbConfig');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();



// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://pregnancy-rose-ob-4397011a5a44.herokuapp.com' 
    : 'http://localhost:5001', // Frontend URL for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
console.log('Database: ', process.env.DB_NAME);
// Middleware
app.use(express.json());


const db = mysql.createConnection(getDbConfig());

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);

    return;
  }
  console.log('Connected to database.');


  // Create 'diet' table if it doesn't exist
  const createDietTableQuery = `
    CREATE TABLE IF NOT EXISTS diet (
      id INT AUTO_INCREMENT PRIMARY KEY,
      food_name VARCHAR(255) NOT NULL,
      is_safe BOOLEAN NOT NULL,
      cite_sources TEXT NULL
    )
  `;

  db.query(createDietTableQuery, (err) => {
    if (err) {
      console.error('Error creating diet table:', err);
    } else {
      console.log('Diet table is ready.');
    }
  });
});

// API Endpoint
// API Routes
app.get('/api/diet', (req, res) => {
  console.log('GET /api/diet hit');
  db.query('SELECT * FROM diet', (err, results) => {
    if (err) {
      res.status(500).send(err); // Send error if query fails
    } else {
      res.json(results); // Send query results as JSON
    }
  });
});

// Serve React App (must be after API routes)
app.use(express.static(path.join(__dirname, '../src/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/build', 'index.html'));
});


// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
