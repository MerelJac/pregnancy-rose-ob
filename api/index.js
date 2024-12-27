const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-heroku-app.herokuapp.com' 
    : 'http://localhost:3000', // Frontend URL for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Database Configuration
const getDbConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    // Parse JawsDB URL
    const url = new URL(process.env.JAWSDB_URL);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''), // Remove leading "/"
    };
  } else {
    // Use local `.env` variables
    return {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
  }
};

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
app.get('/api/diet', (req, res) => {
  db.query('SELECT * FROM diet', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Serve React App
app.use(express.static(path.join(__dirname, '../src/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/build', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
