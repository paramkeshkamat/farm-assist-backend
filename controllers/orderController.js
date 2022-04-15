const createError = require("http-errors");
const mongoose = require("mongoose");
const Order = require("../models/order");

module.exports = {
  getOrders: async (req, res, next) => {
    try {
      let { page, limit, category } = req.query;
      let { sellerId, buyerId } = req.body;
      if (!limit || limit > 20) {
        limit = 20;
      }
      if (!page) {
        page = 1;
      }
      let orders;
      if (category) {
        orders = await Order.find(
          { productCategory: category, $or: [{ sellerId }, { buyerId }] },
          { __v: 0 }
        )
          .limit(parseInt(limit))
          .skip(parseInt((page - 1) * parseInt(limit)));
      } else {
        orders = await Order.find(
          { $or: [{ sellerId }, { buyerId }] },
          { __v: 0 }
        )
          .limit(parseInt(limit))
          .skip(parseInt((page - 1) * parseInt(limit)));
      }
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  },

  createOrder: async (req, res, next) => {
    try {
      const {
        buyerId,
        sellerId,
        productName,
        productImage,
        productCategory,
        quantity,
        totalPrice,
      } = req.body;
      if (
        !buyerId ||
        !sellerId ||
        !productName ||
        !productImage ||
        !productCategory ||
        !quantity ||
        !totalPrice
      ) {
        throw createError.UnprocessableEntity(
          "Please send all the required details"
        );
      }
      const order = new Order({ ...req.body, isDelivered: false });
      const savedOrder = await order.save();
      res.status(201).json({
        status: 201,
        message: "Order created successfully",
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        next(createError.UnprocessableEntity(err.message));
        return;
      }
      next(err);
    }
  },

  deleteOrder: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) {
        throw createError.NotFound("Order not found");
      }
      res.status(200).json({
        status: 200,
        message: "Order deleted successfully",
      });
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid user id"));
        return;
      }
      next(err);
    }
  },
};
