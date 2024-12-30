import React, { useEffect, useState } from 'react';
import isDevelopmentEnv from '../functions/getUrl';
import {getUserId } from '../functions/getUUID';

function Recipes() {
  const [recipes, setRecipes] = useState([]); // Saved recipes
  const [env, setEnv] = useState(false); // Tracks if in development environment
    const [userId, setUserId] = useState(''); // User ID
    
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




  useEffect(() => {
    const isDev = isDevelopmentEnv(); // Call the function
    setEnv(isDev); // Set the environment state

    const id = getUserId(); // Fetch or generate userId
    setUserId(id); // Save userId in state
    console.log('User ID initialized:', id);
  }, []); // Only runs on component mount

  useEffect(() => {
    const baseUrl = env
      ? "http://localhost:5001/api/recipes"
      : "https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/api/recipes";
  
    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecipes(data.recipes);
        } else {
          console.error("Failed to fetch recipes:", data.error);
        }
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }, [env]);
  

  return (
<>
    {/* Saved Recipes */}
    <div>
  <h2>Saved Recipes</h2>
  {recipes.map((recipe) => (
    <div key={recipe.id}>
      <h3>Recipe #{recipe.id}</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <p>{recipe.instructions}</p>
    </div>
  ))}
</div>

</>
  )
}

export default Recipes
