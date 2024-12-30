import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import isDevelopmentEnv from '../functions/getUrl';

function RecipeDetail() {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [env, setEnv] = useState(null); // Initialize as null to wait for environment determination

  useEffect(() => {
    // Determine environment
    const isDev = isDevelopmentEnv();
    setEnv(isDev);
  }, []);

  useEffect(() => {
    // Wait until `env` is determined before making the fetch call
    if (env === null) return;

    const baseUrl = env
      ? `http://localhost:5001/api/recipes/${id}`
      : `https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/api/recipes/${id}`;

    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecipe(data.recipe);
        } else {
          console.error('Failed to fetch recipe:', data.error);
        }
      })
      .catch((error) => console.error('Error fetching recipe:', error));
  }, [env, id]); // Depend on `env` and `id`

  if (env === null) {
    return <p>Determining environment...</p>;
  }

  if (!recipe) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div className="recipe-detail">
      <h2>{recipe.name}</h2>
      <h3>Ingredients:</h3>
      <ul className='recipe-style'>
        {JSON.parse(recipe.ingredients).map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <ol className='recipe-style'>
  {recipe.instructions.split(/\n|\d+\.\s/).filter(Boolean).map((step, index) => (
    <li key={index}>{step.trim()}</li>
  ))}
</ol>

      <h3>Notes:</h3>
      <p >{recipe.notes}</p>

    </div>

  );
}

export default RecipeDetail;
