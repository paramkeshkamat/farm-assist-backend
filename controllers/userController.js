/** @format */

const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = {
  getUser: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user }, { password: 0, __v: 0 });
      if (!user) {
        throw createError.NotFound("User not found");
      }
      res.status(200).json(user);
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid user id"));
        return;
      }
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user, { ...req.body }, { new: true });
      if (!updatedUser) {
        throw createError.NotFound("User not found");
      }
      res.status(200).json({
        status: 200,
        message: "User updated successfully",
      });
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid user id"));
        return;
      }
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user);
      if (!deletedUser) {
        throw createError.NotFound("User not found");
      }
      res.status(200).json({
        status: 200,
        message: "User deleted successfully",
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
