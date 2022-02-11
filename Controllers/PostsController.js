const Post = require("../modals/Post");

const PostController = {
  getPosts: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.userId }).populate("user", [
        "username",
      ]);
      res.json({ success: true, posts });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Internal Server Error" });
    }
  },
  createPost: async (req, res) => {
    const { title, description, url, status } = req.body;

    // Simple validation
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });

    try {
      const newPost = new Post({
        title,
        description,
        url: url.startsWith("https://") ? url : `https://${url}`,
        status: status || "TO LEARN",
        user: req.userId,
      });

      await newPost.save();

      res.json({ success: true, message: "Happy learning!", post: newPost });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  updatePost: async (req, res) => {
    const { title, description, url, status } = req.body;
    // Simple validation
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Tittle is required!" });

    let updatedPost = {
      title: title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "TO LEARN",
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    try {
      updatedPost = await Post.findOneAndUpdate(
        postUpdateCondition,
        updatedPost,
        { new: true }
      );
      // User not authorized or post not found
      if (!updatedPost)
        return res.status(401).json({
          success: false,
          message: "Post is not found or user not authorized",
        });

      res.json({ success: true, post: updatedPost });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  deletePost: async (req, res) => {
    try {
      const postDeleteCondition = { _id: req.params.id, user: req.userId };

      const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

      if (!deletedPost)
        return res.status(401).json({
          success: false,
          message: "Post not found or user not authorized",
        });

      res.json({
        success: true,
        message: "Delete successfully",
        post: deletedPost,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
};

module.exports = PostController;
