const mysql = require('mysql2');
const { getDbConfig } = require('./dbConfig');

// Database Connection
const db = mysql.createConnection(getDbConfig());

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1);
  }
  console.log('Connected to database for seeding.');
});

// Seed data
const seedFoods = [
  { food_name: 'Apple', is_safe: true, cite_sources: 'https://example.com/apple', user_id: 'admin1234' },
  { food_name: 'Peanut', is_safe: false, cite_sources: 'https://example.com/peanut', user_id: 'admin1234' },
  { food_name: 'Carrot', is_safe: true, cite_sources: 'https://example.com/carrot', user_id: 'admin1234' },
  { food_name: 'Raw Fish', is_safe: false, cite_sources: 'https://example.com/raw-fish', user_id: 'admin1234' },
  { food_name: 'Banana', is_safe: true, cite_sources: null, user_id: 'admin1234' },
  { food_name: 'Raw or undercooked poultry or meat', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Unheated deli meats, cold cuts, hot dogs, and fermented or dry sausages', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Refrigerated pâté or meat spreads', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Premade deli salads (coleslaw, potato salad, tuna salad, chicken salad, egg salad)', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Raw or undercooked sprouts (alfalfa, bean)', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Unwashed fresh fruits and vegetables', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Cut melon left out for more than 2 hours', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Unpasteurized juice or cider', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Unpasteurized (raw) milk and dairy products', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Soft cheeses made from unpasteurized milk (queso fresco, brie, camembert, blue-veined cheese)', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Raw or undercooked eggs', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Foods containing raw or undercooked eggs (homemade Caesar dressing, raw cookie dough, cake batter)', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Raw or undercooked fish and shellfish', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Refrigerated smoked seafood', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Fish high in mercury (king mackerel, marlin, orange roughy, shark, swordfish, tilefish, bigeye tuna)', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Alcoholic beverages', is_safe: false, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Poultry and meat cooked to safe internal temperatures', is_safe: true, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Deli meats, cold cuts, hot dogs heated to 165°F or steaming hot', is_safe: true, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Pasteurized milk and dairy products', is_safe: true, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Hard cheeses (cheddar, swiss)', is_safe: true, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Cooked eggs with firm yolks and whites', is_safe: true, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Fish and shellfish cooked to 145°F', is_safe: true, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Fish lower in mercury (salmon, shrimp, pollock, tilapia, cod, catfish)', is_safe: true, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' },
  { food_name: 'Non-alcoholic beverages', is_safe: true, cite_sources: 'https://www.cdc.gov/food-safety/foods/pregnant-people.html', user_id: 'admin1234' }
];

// MIRGATION DATA
        const checkAndAddColumn = `
          ALTER TABLE recipe MODIFY COLUMN name VARCHAR(255) NULL;
        `;

        // Execute query
        db.query(checkAndAddColumn, (err) => {
          if (err) {
            // If the error code indicates the column already exists, log a message
            if (err.code === 'ER_DUP_FIELDNAME') {
              console.log('Column "name" already exists in "recipe" table.');
            } else {
              console.error('Error adding column "name":', err);
              process.exit(1); // Exit on other errors
            }
          } else {
            console.log('Column "name" successfully added.');
          }
        });

// Function to seed the database and prevent duplicates
const seedDatabase = () => {


    // Create 'recipe' table if it doesn't exist
    const createRecipeTableQuery = `
      CREATE TABLE IF NOT EXISTS recipe (
        id INT AUTO_INCREMENT PRIMARY KEY,
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

  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS diet (
      id INT AUTO_INCREMENT PRIMARY KEY,
      food_name VARCHAR(255) NOT NULL,
      is_safe BOOLEAN NOT NULL,
      cite_sources TEXT NULL,
      user_id TEXT NOT NULL,
      UNIQUE KEY unique_food_user (food_name, user_id) -- Composite unique key
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating diet table:', err);
      db.end();
      process.exit(1);
    }
    console.log('Diet table created or already exists.');

    // Insert seed data
    const insertQuery = `
      INSERT INTO diet (food_name, is_safe, cite_sources, user_id)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      is_safe=VALUES(is_safe),
      cite_sources=VALUES(cite_sources);
    `;

    seedFoods.forEach((food) => {
      db.query(
        insertQuery,
        [food.food_name, food.is_safe, food.cite_sources || null, food.user_id],
        (err) => {
          if (err) {
            console.error('Error inserting seed data:', err);
          } else {
            console.log(`Seeded food: ${food.food_name}`);
          }
        }
      );
    });


    // Close connection
    db.end(() => {
      console.log('Database connection closed.');
    });
  });
};

// Seed the database
seedDatabase();
