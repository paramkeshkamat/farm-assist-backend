const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  buyerId: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  isDelivered: {
    type: Boolean,
    required: true,
  },
});

const Order = mongoose.model("order", OrderSchema);
module.exports = Order;
