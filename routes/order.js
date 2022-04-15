const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const orderController = require("../controllers/orderController");

router.post("/get-orders", auth, orderController.getOrders);
router.post("/", auth, orderController.createOrder);
router.delete("/:id", auth, orderController.deleteOrder);

module.exports = router;
