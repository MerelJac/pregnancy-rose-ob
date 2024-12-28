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
  { food_name: 'Apple', is_safe: true, cite_sources: 'https://example.com/apple' },
  { food_name: 'Peanut', is_safe: false, cite_sources: 'https://example.com/peanut' },
  { food_name: 'Carrot', is_safe: true, cite_sources: 'https://example.com/carrot' },
  { food_name: 'Raw Fish', is_safe: false, cite_sources: 'https://example.com/raw-fish' },
  { food_name: 'Banana', is_safe: true, cite_sources: null },
];

// Function to seed the database and prevent duplicates
const seedDatabase = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS diet (
      id INT AUTO_INCREMENT PRIMARY KEY,
      food_name VARCHAR(255) NOT NULL,
      is_safe BOOLEAN NOT NULL,
      cite_sources TEXT
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
      INSERT INTO diet (food_name, is_safe, cite_sources)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE food_name=VALUES(food_name);
    `;

    seedFoods.forEach((food) => {
      db.query(insertQuery, [food.food_name, food.is_safe, food.cite_sources], (err) => {
        if (err) {
          console.error('Error inserting seed data:', err);
        } else {
          console.log(`Seeded food: ${food.food_name}`);
        }
      });
    });

    // Close connection
    db.end(() => {
      console.log('Database connection closed.');
    });
  });
};

// Seed the database
seedDatabase();
