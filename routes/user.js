/** @format */

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.get("/get-user", auth, userController.getUser);
router.patch("/update-user", auth, userController.updateUser);
router.delete("/delete-user", auth, userController.deleteUser);

module.exports = router;
