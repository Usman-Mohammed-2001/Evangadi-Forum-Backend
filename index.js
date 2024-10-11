const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware to parse JSON
app.use(express.json());

//import database
const dbConnection = require('./db/dbConfig')

// Imports routes for question
const questionRoutes = require("./routes/questionRoute");

// Import routes
const userRoutes = require('./routes/userRoutes');

//import authMiddleware
const authMiddleware = require('./middleware/authMiddleware')

// Use user routes
app.use('/', (req, res) => {
  res.json("Backend Server")
});


// Use user routes
app.use('/api/users', userRoutes);

// questions routes
app.use("/api/questions", authMiddleware, questionRoutes);



async function start()
{
  try {
      const result = await dbConnection.execute("select 'test '")
      await app.listen(PORT)
      console.log("database connection is established")
      console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.log(err.message)
  }
}

start();


