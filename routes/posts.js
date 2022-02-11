const express = require("express");
const router = express.Router();
const PostsController = require("../Controllers/PostsController");
const verifyToken = require("../middlewares/auth");

// @route GET /v1/posts
// @desc Get all posts of user logged in
// @access Private
router.get("/", verifyToken, PostsController.getPosts);

// @route POST /v1/posts
// @desc Create post
// @access Private
router.post("/", verifyToken, PostsController.createPost);

// @route PUT /v1/posts/:id
// @desc Update post
// @access Private
router.put("/:id", verifyToken, PostsController.updatePost);

// @route DELETE /v1/posts/:id
// @desc Update post
// @access Private
router.delete("/:id", verifyToken, PostsController.deletePost);

module.exports = router;
