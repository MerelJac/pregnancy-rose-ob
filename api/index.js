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
      cite_sources TEXT NULL,
      user_id TEXT NOT NULL
    )
  `;

  db.query(createDietTableQuery, (err) => {
    if (err) {
      console.error('Error creating diet table:', err);
    } else {
      console.log('Diet table is ready.');
    }
  });

    // Create 'recipe' table if it doesn't exist
    const createRecipeTableQuery = `
      CREATE TABLE IF NOT EXISTS recipe (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NULL,
        ingredients JSON NOT NULL, -- Use JSON to store ingredient arrays
        instructions TEXT NULL,    -- Store recipe instructions
        user_id TEXT NOT NULL      -- Link to the user who created the recipe
      )
    `;

  db.query(createRecipeTableQuery, (err) => {
    if (err) {
      console.error('Error creating recipe table:', err);
    } else {
      console.log('Recipe table is ready.');
    }
  });

});

// API Routes
app.post('/get/diet', (req, res) => {
  const { userId } = req.body; // Extract userId from the request body

  console.log('GET /get/diet hit for userId: ', userId);

  const query = `
    SELECT * FROM diet
    WHERE user_id = ? OR user_id = 'admin1234'
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Error fetching data.');
    } else {
      res.status(200).json(results); // Send query results as JSON
    }
  });
});


app.post('/api/diet', (req, res) => {
  console.log('POST /api/diet hit');

  const { food_name, is_safe, cite_sources, user_id } = req.body; // Destructure the request body

  // Validate required fields
  if (!food_name || is_safe === undefined) {
    return res.status(400).send('Missing required fields: food_name or is_safe');
  }

  // SQL query to insert the new food item
  const query = `
    INSERT INTO diet (food_name, is_safe, cite_sources, user_id)
    VALUES (?, ?, ?, ?)
  `;

  // If cite_sources is not provided, insert NULL instead
  const values = [food_name, is_safe, cite_sources || null, user_id];

  // Execute the query
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).send('Failed to insert data into the database');
    }

    console.log('Food item added successfully:', results);

    // Send the inserted food item back with its new ID
    const newFood = { id: results.insertId, food_name, is_safe, cite_sources: cite_sources || null, user: user_id };
    res.status(201).json(newFood);
  });
});

// Recipe generation route
app.post("/api/generate-recipe", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ success: false, error: "Invalid ingredients" });
  }

  try {
    const recipeContent = await generateCompletion(ingredients);

    // Save to the database
    const insertQuery = `
      INSERT INTO recipe (ingredients, instructions, user_id)
      VALUES (?, ?, ?)
    `;

    // FAKES USERID
    db.query(
      insertQuery,
      [JSON.stringify(ingredients), recipeContent, 'admin1234'],
      (err, result) => {
        if (err) {
          console.error("Database insert error:", err);
          return res.status(500).json({ success: false, error: "Failed to save recipe" });
        }

        res.json({
          success: true,
          recipe: {
            id: result.insertId,
            ingredients,
            instructions: recipeContent,
          },
        });
      }
    );
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch saved recipes
app.get("/api/recipes", (req, res) => {
  const query = "SELECT id, ingredients, instructions FROM recipe";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res.status(500).json({ success: false, error: "Failed to fetch recipes" });
    }

    const recipes = results.map((row) => ({
      id: row.id,
      ingredients: JSON.parse(row.ingredients),
      instructions: row.instructions,

    }));

    res.json({ success: true, recipes });
  });
});


app.delete('/api/diet', (req, res) => {
  const { ids, userId } = req.body; // Array of IDs to delete

  console.log('Ids for deleting: ', ids, 'UserId: ', userId);

  if (!ids || !Array.isArray(ids) || !userId) {
    return res.status(400).json({ error: 'Invalid request body or missing userId' });
  }

  const query = 'DELETE FROM diet WHERE id IN (?) AND user_id = ?';

  db.query(query, [ids, userId], (err, results) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).json({ error: 'Failed to delete items' });
    }

    res.status(200).json({ deletedCount: results.affectedRows });
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
