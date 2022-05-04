/** @format */

const mongoose = require("mongoose");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const Seller = require("../models/seller");
const generatePassword = require("../helpers/passwordGenerator");
const sendMail = require("../helpers/sendMail");
const { getJwtToken } = require("../helpers/jwtHelper");

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
        password: generatePassword(24).trim(),
        status: "Pending",
      });

      const savedSeller = await seller.save();
      res.status(201).json({
        message: "Seller created successfully",
      });
    } catch (err) {
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
        if (status === "Approved") {
          const password = generatePassword(8).trim();
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const updated = await Seller.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true },
          );
          if (updated) {
            sendMail(
              email,
              "Seller Approval for FarmAssist",
              `<div>
              <p>Your request for becoming a seller has been accepted.<p>
              <br/>
              <p>Here are your credentials which you can use to access farmAssist dashboard<p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Password:</b> ${password}</p>
              <br/>
              <p>We hope that you'll have a great experience using farmAssist.
              </div>
              `,
            );
          }
        } else if (status === "Disapproved") {
          sendMail(
            email,
            "Seller Approval for FarmAssist",
            "<p>Unfortunately your request for becoming a seller has been rejected!</p>",
          );
        }
        res.send({ message: "Seller status updated successfully" });
      }
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid seller id"));
        return;
      }
      next(err);
    }
  },

  sellerLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw createError.UnprocessableEntity("Please send all the required details");
      }

      const doesExist = await Seller.findOne({ email, status: "Approved" });
      if (!doesExist) {
        throw createError.Unauthorized("Invalid Credentials");
      }

      const correctPassword = await bcrypt.compare(password, doesExist.password);
      if (!correctPassword) {
        throw createError.Unauthorized("Invalid Credentials");
      }
      const token = getJwtToken(doesExist._id);
      res.status(200).json({
        message: "User logged in successfully",
        accessToken: token,
      });
    } catch (err) {
      next(err);
    }
  },

  getSingleSeller: async (req, res, next) => {
    try {
      const seller = await Seller.findOne({ _id: req.user }, { password: 0, __v: 0 });
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

  changePassword: async (req, res, next) => {
    try {
      const { password } = req.body;
      if (!password) {
        throw createError.UnprocessableEntity("Password is required");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const updated = await Seller.findByIdAndUpdate(
        req.user,
        { password: hashedPassword },
        { new: true },
      );

      if (updated) {
        res.status(200).json({ message: "Password has been updated successfully!" });
      }
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid seller id"));
        return;
      }
      next(err);
    }
  },
};
