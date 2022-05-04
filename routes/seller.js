/** @format */

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const sellerController = require("../controllers/sellerController");

router.post("/seller/create", sellerController.createSeller);
router.get("/single-seller", auth, sellerController.getSingleSeller);
router.get("/seller-by-id/:id", sellerController.getSeller);
router.post("/seller", sellerController.getSellers);
router.post("/seller/change-status/:id", sellerController.changeStatus);
router.post("/seller/login", sellerController.sellerLogin);
router.post("/seller/change-password", auth, sellerController.changePassword);

// router.patch("/update-user", auth, userController.updateUser);
// router.delete("/delete-user", auth, userController.deleteUser);

module.exports = router;
