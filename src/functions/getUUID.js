// Simple UUID generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Set UUID if not already set in localStorage
const getUserId = () => {
  const key = 'user_id_pregnancy'; // Unique key for this app
  let userId = localStorage.getItem(key);

  if (!userId) {
    userId = generateUUID(); // Generate a new UUID
    localStorage.setItem(key, userId); // Store it in localStorage
  }

  return userId; // Return the user's unique ID
};

// Export the functions using CommonJS
module.exports = { generateUUID, getUserId };
