/** @format */

const createError = require("http-errors");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { getJwtToken } = require("../helpers/jwtHelper");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, address, city, state, pincode, phoneNumber } = req.body;
      if (!name || !email || !phoneNumber || !address || !city || !state || !pincode) {
        throw createError.UnprocessableEntity("Please send all the required details");
      }

      const doesExist = await User.findOne({ email });
      if (doesExist) {
        throw createError.Conflict("User with this email already exists!");
      }

      const user = new User({
        ...req.body,
        profileImage: "",
      });
      const savedUser = await user.save();
      const token = getJwtToken(savedUser._id);

      res.status(201).json({
        message: "User created successfully",
        accessToken: token,
      });
    } catch (err) {
      next(err);
    }
  },

  checkAuth: async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        throw createError.UnprocessableEntity("Phone Number is required!");
      }
      const doesExist = await User.findOne({ phoneNumber });
      if (!doesExist) {
        throw createError.Unauthorized("User does not exist");
      } else {
        const token = getJwtToken(doesExist._id);
        res.status(200).json({
          message: "User logged in successfully",
          accessToken: token,
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
