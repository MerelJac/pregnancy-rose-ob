const isDevelopmentEnv = () => {
    if (typeof window !== "undefined") {
      // Check if the URL contains 'localhost'
      return window.location.hostname.includes("localhost");
    }
    // Fallback for non-browser environments
    return false;
  };
  
  export default isDevelopmentEnv;
  