const { URL } = require('url');

console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
const getDbConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    // Parse JawsDB URL
    const url = new URL(process.env.JAWSDB_URL);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''), // Remove leading "/"
    };
  } else {
    // Use local `.env` variables
    return {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    };
  }
};

module.exports = { getDbConfig };
