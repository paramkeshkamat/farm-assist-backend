/** @format */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
