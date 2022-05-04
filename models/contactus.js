/** @format */

const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Contactus = mongoose.model("contactus", ContactUsSchema);
module.exports = Contactus;
