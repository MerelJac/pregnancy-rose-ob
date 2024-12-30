import React, { useEffect, useState } from 'react';
import isDevelopmentEnv from '../functions/getUrl';
import {getUserId } from '../functions/getUUID';

export default function Diet() {
  const [foods, setFoods] = useState([]); // All foods
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [newFood, setNewFood] = useState({ food_name: '', is_safe: true, cite_sources: '' }); // Form state
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [filteredFoods, setFilteredFoods] = useState([]); // Filtered foods
  const [selectedFoods, setSelectedFoods] = useState([]); // Foods selected for recipe
  const [recipes, setRecipes] = useState([]); // Saved recipes
  const [env, setEnv] = useState(false); // Tracks if in development environment
  const [userId, setUserId] = useState(''); // User ID

  useEffect(() => {
    const isDev = isDevelopmentEnv(); // Call the function
    setEnv(isDev); // Set the environment state

    const id = getUserId(); // Fetch or generate userId
    setUserId(id); // Save userId in state
    console.log('User ID initialized:', id);
  }, []); // Only runs on component mount

  useEffect(() => {
    const baseUrl = env
    ? 'http://localhost:5001/get/diet' // Development URL
    : 'https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/get/diet'; // Production URL
    const userIdPayload = { userId }; // Wrap userId in an object

    fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userIdPayload), // Pass userId as part of an object
    })
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
  }, [userId, env]);
  
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

  // Handle delete action
  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedFoods.length} items?`
      )
    ) {
      const idsForDeleting = selectedFoods.map((food) => food.id);
  
      console.log('Ids for deleting: ', idsForDeleting, 'User: ', userId);
  
      const baseUrl = env
        ? 'http://localhost:5001/api/diet'
        : 'https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/api/diet';
  
      fetch(baseUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsForDeleting, userId }),
      })
        .then((res) => {
          console.log('Delete response status:', res.status);
          if (!res.ok) {
            return res.json().then((error) => {
              throw new Error(error.error || 'Unknown error occurred');
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log('Delete response data:', data);
  
          const updatedFoods = foods.filter(
            (food) => !idsForDeleting.includes(food.id)
          );
          setFoods(updatedFoods); // Reset the foods list
          setFilteredFoods(updatedFoods); // Reset the filtered foods list
          setSelectedFoods([]); // Clear the selection
        })
        .catch((err) => {
          console.error('Delete or refresh error:', err);
          alert(err.message || 'Failed to delete items.');
        });
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
    : 'https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/api/diet'; // Production URL


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

  useEffect(() => {
    // Load recipes from local storage on component mount
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    setRecipes(savedRecipes);
  }, []);

    // Open modal
    const openModal = () => setIsModalOpen(true);

    // Close modal
    const closeModal = () => {
      setIsModalOpen(false);
      setNewFood({ food_name: '', is_safe: true, cite_sources: '' }); // Reset form
    };

    // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFood((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    console.log('New Food: ', newFood);
    e.preventDefault();
    const baseUrl = env
    ? 'http://localhost:5001/api/diet' // Development URL
    : 'https://pregnancy-rose-ob-4397011a5a44.herokuapp.com/api/diet'; // Production URL

    // Add userId to the newFood object before sending
    const foodWithUserId = { ...newFood, user_id: userId };
    console.log('New Food: ', newFood, 'User Id: ', userId);
    fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(foodWithUserId),
    })
      .then((res) => res.json())
      .then((newItem) => {
        setFoods((prev) => [...prev, newItem]); // Update UI with new item
        closeModal(); // Close modal
      })
      .catch((err) => console.error('Post error:', err));
  };
  return (
    <div>
      <h1>Diet Page</h1>
      <p>Search for foods you want to eat during pregnancy.</p>

      {/* Search Bar */}
      <div className='flex-column'>
        <input
          type="text"
          placeholder="Search for foods..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={openModal}>Add new food</button>
      </div>

      {/* Food Results */}
      <div className='overflow-scroll'>
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
        <button style={{ marginTop: '5px' }} onClick={generateRecipe}>Generate Recipe</button>
      </div>
      {/* Delete Food Record */}
      <button style={{ marginTop: '5px' }}
        onClick={handleDelete}
        disabled={selectedFoods.length === 0} // Disable if no items selected
      >
        Delete Selected Items
      </button>

      {/* Modal */}
    {isModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <h2>Add New Food</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Food Name:
                <input
                  type="text"
                  name="food_name"
                  value={newFood.food_name}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Is Safe:
                <input
                  type="checkbox"
                  name="is_safe"
                  checked={newFood.is_safe}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Source:
                <input
                  type="text"
                  name="cite_sources"
                  value={newFood.cite_sources}
                  onChange={handleChange}
                />
              </label>
            </div>
            <button type="submit">Add Food</button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    )}

    {/* Modal Styles */}
    <style>
      {`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          max-width: 400px;
          width: 100%;
        }
        form div {
          margin-bottom: 10px;
        }
      `}
    </style>
    </div>
    
  );
}
