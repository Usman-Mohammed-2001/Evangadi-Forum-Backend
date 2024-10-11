const mysql2 = require("mysql2");
require('dotenv').config(); // Load environment variables from .env

// Create a MySQL connection
const dbConnection = mysql2.createPool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10),
});

module.exports = dbConnection.promise();
