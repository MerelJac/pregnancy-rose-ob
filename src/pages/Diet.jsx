import React, { useEffect, useState } from 'react';

export default function Diet() {
  const [foods, setFoods] = useState([]); // Store all foods
  const [searchTerm, setSearchTerm] = useState(''); // Store search term
  const [filteredFoods, setFilteredFoods] = useState([]); // Store filtered foods

  useEffect(() => {
    // Fetch foods data on component mount
    fetch('https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/api/diet')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setFoods(data); // Save the fetched foods
        setFilteredFoods(data); // Initialize filtered foods with all data
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredFoods(
      foods.filter((food) => food.name.toLowerCase().includes(term))
    );
  };

  return (
    <div>
      <p>Search for foods!</p>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search for foods..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '300px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Results */}
      <div>
        {filteredFoods.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredFoods.map((food) => (
              <li
                key={food.id}
                style={{
                  margin: '5px 0',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                {food.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No foods found.</p>
        )}
      </div>
    </div>
  );
}
