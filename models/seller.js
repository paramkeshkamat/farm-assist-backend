/** @format */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  pincode: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

SellerSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const Seller = mongoose.model("seller", SellerSchema);
module.exports = Seller;
