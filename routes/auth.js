const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/checkAuth", authController.checkAuth)

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzA1ZTg5M2Q2NjVjYzUzNjBjOTU1ZiIsImlhdCI6MTYzNDc1NDE4NX0.55JOLBj_wNmdlbwtsgIx-whxoZXBFwQ9XJt5wvgUEdY
