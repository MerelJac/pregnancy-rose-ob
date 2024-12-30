import React, { useEffect, useState } from 'react';

function Recipes() {
  const [recipes, setRecipes] = useState([]); // Saved recipes

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
<>
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
</>
  )
}

export default Recipes
