/** @format */

const createError = require("http-errors");
const bcrypt = require("bcrypt");
const Seller = require("../models/seller");
const { getJwtToken } = require("../helpers/jwtHelper");
const mongoose = require("mongoose");
const sendMail = require("../helpers/sendMail");

module.exports = {
  createSeller: async (req, res, next) => {
    try {
      const { name, email, address, city, state, pincode, phoneNumber } = req.body;
      if (!name || !email || !phoneNumber || !address || !city || !state || !pincode) {
        throw createError.UnprocessableEntity("Please send all the required details");
      }

      const doesEmailExist = await Seller.findOne({ email });
      if (doesEmailExist) {
        throw createError.Conflict("Seller with this email already exists!");
      }
      const doesPhoneNumberExist = await Seller.findOne({ phoneNumber });
      if (doesPhoneNumberExist) {
        throw createError.Conflict("Seller with this phone number already exists!");
      }

      const seller = new Seller({
        ...req.body,
        password: "test",
        status: "Not Approved",
      });

      const savedSeller = await seller.save();
      console.log(savedSeller);
      res.status(201).json({
        message: "Seller created successfully",
      });
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  },

  getSeller: async (req, res, next) => {
    try {
      const seller = await Seller.findOne({ _id: req.params.id }, { password: 0, __v: 0 });
      if (!seller) {
        throw createError.NotFound("Seller not found");
      }
      res.status(200).json(seller);
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid seller id"));
        return;
      }
      next(err);
    }
  },

  getSellers: async (req, res, next) => {
    try {
      const { status } = req.body;
      if (!status) {
        throw createError.UnprocessableEntity("Please send status");
      }
      const seller = await Seller.find({ status }, { password: 0, __v: 0 });
      res.send(seller);
    } catch (err) {
      next(err);
    }
  },

  changeStatus: async (req, res, next) => {
    try {
      const { status, email } = req.body;
      const { id } = req.params;
      if (!status) {
        throw createError.UnprocessableEntity("Please send status");
      }
      const updatedSeller = await Seller.findByIdAndUpdate(id, { status }, { new: true });
      if (updatedSeller) {
        sendMail(email, "Seller Approval for FarmAssist", "test mail");
        res.send({ message: "Seller status updated successfully" });
      }
    } catch (err) {
      console.log(err.message);
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid seller id"));
        return;
      }
      next(err);
    }
  },
};
