const express = require("express");
const router = express.Router();

const upload = require("../middlewares/multerMiddleware");
const auth = require("../middlewares/authMiddleware");
const forumController = require("../controllers/forumController");

router.post("/", auth, forumController.addPost);
router.get("/", forumController.getAllPosts);
router.get("/:id", forumController.getSinglePost);
router.patch("/:id", auth, upload.single("forumImage"), forumController.updatePost);
router.delete("/:id", auth, forumController.deletePost);

module.exports = router;
