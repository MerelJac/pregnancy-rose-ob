import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import isDevelopmentEnv from '../functions/getUrl';
import { getUserId } from '../functions/getUUID';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [env, setEnv] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const isDev = isDevelopmentEnv();
    setEnv(isDev);

    const id = getUserId();
    setUserId(id);
    console.log('User ID initialized:', id);
  }, []);

  useEffect(() => {
    const baseUrl = env
      ? 'http://localhost:5001/api/recipes'
      : 'https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/api/recipes';

    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const sortedRecipes = data.recipes.sort((a, b) => new Date(b.date) - new Date(a.date));
          setRecipes(sortedRecipes);
        } else {
          console.error('Failed to fetch recipes:', data.error);
        }
      })
      .catch((error) => console.error('Error fetching recipes:', error));
  }, [env]);

  return (
    <div className="recipes-container">
      <h2 className="title">Saved Recipes</h2>
      <div className="recipes-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <h3 className="recipe-title">
              <Link to={`/recipes/${recipe.id}`} className="recipe-link">
                {recipe.name}
              </Link>
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipes;
