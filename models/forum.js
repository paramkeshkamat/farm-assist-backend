const mongoose = require("mongoose");

const ForumSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  forumText: {
    type: String,
    required: false,
  },
  forumImage: {
    type: String,
    required: false,
  },
  upvotes: {
    type: Array,
    required: true,
  },
  downvotes: {
    type: Array,
    required: true,
  },
  tags: {
    type: Array,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  comments: [
    {
      commenterId: {
        type: String,
        required: true,
      },
      commentText: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
    {},
  ],
});

const Forum = mongoose.model("forum", ForumSchema);
module.exports = Forum;
