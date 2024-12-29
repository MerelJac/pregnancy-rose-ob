import React, { useEffect, useState } from 'react';
import isDevelopmentEnv from '../functions/getUrl';

export default function Diet() {
  const [foods, setFoods] = useState([]); // All foods
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [filteredFoods, setFilteredFoods] = useState([]); // Filtered foods
  const [selectedFoods, setSelectedFoods] = useState([]); // Foods selected for recipe
  const [recipes, setRecipes] = useState([]); // Saved recipes
  const [env, setEnv] = useState(false); // Tracks if in development environment

  useEffect(() => {
    const isDev = isDevelopmentEnv(); // Call the function
    setEnv(isDev); // Set the environment state

  }, []); // Only runs on component mount

  useEffect(() => {
    const baseUrl = env
    ? 'http://localhost:5001/api/diet' // Development URL
    : 'https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/'; // Production URL

  fetch(baseUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched data:', data);
        setFoods(data); // Save fetched foods
        setFilteredFoods(data); // Initialize filtered foods
      })
      .catch((err) => console.error('Fetch error:', err));
  }, [env]);
  
  

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredFoods(
      foods.filter((food) => food.food_name.toLowerCase().includes(term))
    );
  };

  const toggleFoodSelection = (food) => {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(selectedFoods.filter((f) => f !== food));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  
  const generateRecipe = async () => {
    const safeFoods = selectedFoods.filter((food) => food.is_safe);
    if (safeFoods.length === 0) {
      alert("No pregnancy-safe foods selected!");
      return;
    }
  
    const ingredients = safeFoods.map((food) => food.food_name);
  
    const baseUrl = env
    ? 'http://localhost:5001/api/diet' // Development URL
    : 'https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/'; // Production URL


    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        const newRecipe = {
          id: Date.now(),
          items: safeFoods,
          instructions: data.recipe,
        };
  
        setRecipes([...recipes, newRecipe]);
      } else {
        alert(data.error || "Failed to generate recipe.");
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  };

  const saveRecipe = (recipe) => {
    // Save recipe to local storage or backend
    const updatedRecipes = [...recipes, recipe];
    setRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
  };

  useEffect(() => {
    // Load recipes from local storage on component mount
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    setRecipes(savedRecipes);
  }, []);

  return (
    <div>
      <h1>Diet Page</h1>
      <p>Search for foods you want to eat during pregnancy.</p>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search for foods..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Food Results */}
      <div>
        {filteredFoods.length > 0 ? (
          <ul className='left-aligned'>
            {filteredFoods.map((food) => (
              <li
                className="list-style"
                key={food.id}
              >
                <input
                  type="checkbox"
                  onChange={() => toggleFoodSelection(food)}
                  checked={selectedFoods.includes(food)}
                />
                <a className='no-link' href={food.cite_sources} target='_blank' alt='Cite Sources Link' rel="noreferrer"
                style={{ color: food.is_safe ? "green" : "red" }}>
                  {food.food_name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No foods found.</p>
        )}
      </div>

      {/* Recipe Actions */}
      <div>
        <button onClick={generateRecipe}>Generate Recipe</button>
      </div>

      {/* Saved Recipes */}
      <div>
        <h2>Saved Recipes</h2>
        {recipes.map((recipe) => (
          <div key={recipe.id}>
            <h3>Recipe #{recipe.id}</h3>
            <ul>
              {recipe.items.map((item) => (
                <li key={item.id}>{item.food_name}</li>
              ))}
            </ul>
            <button onClick={() => saveRecipe(recipe)}>Save Recipe</button>
          </div>
        ))}
      </div>
    </div>
  );
}
