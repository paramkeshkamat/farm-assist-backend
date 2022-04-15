const createError = require("http-errors");
const Forum = require("../models/forum");
const mongoose = require("mongoose");

module.exports = {
  addPost: async (req, res, next) => {
    try {
      const { userId, forumText, tags } = req.body;
      if (!userId) {
        throw createError.UnprocessableEntity("UserId is required");
      }
      const post = new Forum({
        userId,
        forumText: forumText || "",
        forumImage: "",
        upvotes: [],
        downvotes: [],
        tags,
        comments: [],
      });
      const newPost = await post.save();
      res.status(200).json({
        status: 200,
        message: "Post added successfully",
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        next(createError.UnprocessableEntity(err.message));
        return;
      }
      next(err);
    }
  },

  getAllPosts: async (req, res, next) => {
    try {
      let { page, limit, category } = req.query;
      if (!limit || limit > 20) {
        limit = 20;
      }
      if (!page) {
        page = 1;
      }
      const posts = await Forum.find({}, { __v: 0 })
        .limit(parseInt(limit))
        .skip(parseInt((page - 1) * parseInt(limit)));
      res.status(200).json(posts);
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid user id"));
        return;
      }
      next(err);
    }
  },

  getSinglePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const post = await Forum.findOne({ _id: id }, { __v: 0 });
      if (!post) {
        throw createError.NotFound("Post not found");
      }
      res.status(200).json(post);
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid user id"));
        return;
      }
      next(err);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      let updatedPost;
      if (req.file) {
        updatedPost = await Forum.findByIdAndUpdate(
          id,
          {
            ...req.body,
            forumImage: "http://localhost:8000/" + req.file.filename,
          },
          { new: true }
        );
      } else {
        updatedPost = await Forum.findByIdAndUpdate(
          id,
          {
            ...req.body,
          },
          { new: true }
        );
      }
      if (!updatedPost) {
        throw createError.NotFound("Post not found");
      }
      res.status(200).json({
        status: 200,
        message: "Post updated successfully",
      });
    } catch (err) {
      if (err instanceof mongoose.CastError) {
        next(createError.BadRequest("Invalid user id"));
        return;
      }
      next(err);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedPost = await Forum.findByIdAndDelete(id);
      if (!deletedPost) {
        throw createError.NotFound("Post not found");
      }
      res.status(200).json({
        status: 200,
        message: "Post deleted successfully",
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
