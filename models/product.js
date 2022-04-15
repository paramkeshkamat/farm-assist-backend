/** @format */

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: false,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  measurement: {
    type: String,
    required: true,
  },
  totalSales: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
