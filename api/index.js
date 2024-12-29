const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const { generateCompletion } = require("./openai");



const { getDbConfig } = require('./dbConfig');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://pregnancy-rose-ob-4397011a5a44.herokuapp.com' 
    : 'http://localhost:3000', // Frontend URL for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
// CORS middleware must be applied first
app.use(cors(corsOptions));
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

app.post('/api/diet', (req, res) => {
  console.log('POST /api/diet hit');

  const { food_name, is_safe, cite_sources } = req.body; // Destructure the request body

  // Validate required fields
  if (!food_name || is_safe === undefined) {
    return res.status(400).send('Missing required fields: food_name or is_safe');
  }

  // SQL query to insert the new food item
  const query = `
    INSERT INTO diet (food_name, is_safe, cite_sources)
    VALUES (?, ?, ?)
  `;

  // If cite_sources is not provided, insert NULL instead
  const values = [food_name, is_safe, cite_sources || null];

  // Execute the query
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).send('Failed to insert data into the database');
    }

    console.log('Food item added successfully:', results);

    // Send the inserted food item back with its new ID
    const newFood = { id: results.insertId, food_name, is_safe, cite_sources: cite_sources || null };
    res.status(201).json(newFood);
  });
});

// Recipe generation route
app.post("/api/generate-recipe", async (req, res) => {
  const { ingredients } = req.body;

  try {
    const recipe = await generateCompletion(ingredients);
    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/diet', (req, res) => {
  const { ids } = req.body; // Array of IDs to delete
  console.log('Ids for deleting: ', ids)
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).send('Invalid request body');
  }

  const query = 'DELETE FROM diet WHERE id IN (?)';
  db.query(query, [ids], (err, results) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).send('Failed to delete items');
    }

    res.status(200).send({ deletedCount: results.affectedRows });
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
