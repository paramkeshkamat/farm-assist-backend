/** @format */

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getSingleProduct);
router.post("/products", auth, productController.addProduct);
router.patch("/products/:id", auth, productController.updateProduct);
router.delete("/products/:id", auth, productController.deleteProduct);

router.get("/sellers-products", auth, productController.getProductsOfSeller);

module.exports = router;
