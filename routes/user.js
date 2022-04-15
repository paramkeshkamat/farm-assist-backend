/** @format */

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const userController = require("../controllers/userController");

router.get("/get-user", auth, userController.getUser);
router.patch("/update-user/:id", auth, userController.updateUser);
router.delete("/delete-user/:id", auth, userController.deleteUser);
router.patch(
  "/update-profileimage/:id",
  auth,
  upload.single("profileImage"),
  userController.updateProfileImage,
);

module.exports = router;
