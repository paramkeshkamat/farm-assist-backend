/** @format */

const createError = require("http-errors");
const mongoose = require("mongoose");
const Product = require("../models/product");

module.exports = {
  getAllProducts: async (req, res, next) => {
    try {
      let { page, limit, category } = req.query;
      if (!limit) {
        limit = 20;
      }
      if (!page) {
        page = 1;
      }
      let products;
      if (category) {
        products = await Product.find({ productCategory: category }, { __v: 0 })
          .limit(parseInt(limit))
          .skip(parseInt((page - 1) * parseInt(limit)));
      } else {
        products = await Product.find({}, { __v: 0 })
          .limit(parseInt(limit))
          .skip(parseInt((page - 1) * parseInt(limit)));
      }
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },

  getSingleProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({ _id: id }, { __v: 0 });
      if (!product) {
        throw createError.NotFound("Product not found");
      }
      res.status(200).json(product);
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid user id"));
        return;
      }
      next(err);
    }
  },

  addProduct: async (req, res, next) => {
    try {
      const {
        productName,
        productPrice,
        productDescription,
        productCategory,
        quantity,
        measurement,
        productImage,
      } = req.body;
      if (
        !productName ||
        !productDescription ||
        !productCategory ||
        !productPrice ||
        !quantity ||
        !measurement ||
        !productImage
      ) {
        throw createError.UnprocessableEntity("Please send all the required details");
      }
      const product = new Product({
        productName,
        productPrice,
        productImage,
        productDescription,
        productCategory,
        sellerId: req.user,
        quantity,
        measurement,
      });
      const savedProduct = await product.save();
      res.status(201).json({
        status: 201,
        message: "Product created successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        { new: true },
      );
      if (!updatedProduct) {
        throw createError.NotFound("Product not found");
      }
      res.status(200).json({
        status: 200,
        message: "Product updated successfully",
      });
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid user id"));
        return;
      }
      next(err);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw createError.NotFound("Product not found");
      }
      res.status(200).json({
        status: 200,
        message: "Product deleted successfully",
      });
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid user id"));
        return;
      }
      next(err);
    }
  },

  getProductsOfSeller: async (req, res, next) => {
    try {
      const product = await Product.find({ sellerId: req.user }, { __v: 0 });
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  },
};
