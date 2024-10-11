// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get("all-questions", authMiddleware, (req, res) => {
  res.end("all-questions")
})




module.exports = router;
