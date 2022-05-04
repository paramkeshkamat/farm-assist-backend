/** @format */

const createError = require("http-errors");
const ContactUsSchema = require("../models/contactus");

module.exports = {
  getAllMessages: async (req, res, next) => {
    try {
      const messages = await ContactUsSchema.find({}, { __v: 0 });
      res.send(messages);
    } catch (err) {
      next(err);
    }
  },

  getSingleMessage: async (req, res, next) => {
    try {
      const message = await ContactUsSchema.findOne({ _id: req.params.id }, { __v: 0 });
      if (!message) {
        throw createError.NotFound("Message not found");
      }
      res.status(200).json(message);
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid message id"));
        return;
      }
      next(err);
    }
  },

  addMessage: async (req, res, next) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        throw createError.UnprocessableEntity("Please send all the required details");
      }
      const newMessage = new ContactUsSchema(req.body);

      const savedMessage = await newMessage.save();
      res.status(201).json({
        message: "Message added successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};
