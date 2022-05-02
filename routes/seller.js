/** @format */

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const sellerController = require("../controllers/sellerController");

router.post("/create", sellerController.createSeller);
router.get("/:id", sellerController.getSeller);
router.post("/", sellerController.getSellers);
router.post("/change-status/:id", sellerController.changeStatus);

// router.patch("/update-user", auth, userController.updateUser);
// router.delete("/delete-user", auth, userController.deleteUser);

module.exports = router;
