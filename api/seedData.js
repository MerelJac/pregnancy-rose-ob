const mysql = require('mysql');
const { getDbConfig } = require('./dbConfig'); // Import DB configuration logic

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
  db.query('SELECT COUNT(*) AS count FROM diet', (err, results) => {
    if (err) {
      console.error('Error checking diet table count:', err);
      db.end();
      return;
    }
    const count = results[0].count;
    if (count > 0) {
      console.log('Diet table already seeded. Skipping seeding.');
      db.end();
    } else {
      const seedQuery = `
        INSERT INTO diet (food_name, is_safe, cite_sources)
        VALUES ?
      `;

      const values = seedFoods.map((food) => [
        food.food_name,
        food.is_safe,
        food.cite_sources,
      ]);

      db.query(seedQuery, [values], (err) => {
        if (err) {
          console.error('Error seeding diet table:', err);
        } else {
          console.log('Diet table seeded successfully!');
        }
        db.end();
      });
    }
  });
};


// Seed the database
seedDatabase();
