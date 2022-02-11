const User = require("../modals/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const AuthController = {
  registerUser: async (req, res) => {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing username and/or password" });

    try {
      // Check existing username
      const user = await User.findOne({ username });
      if (user)
        return res
          .status(400)
          .json({ success: false, message: "Username has already taken" });

      // All good
      const hashedPassword = await argon2.hash(password);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      //   Return accessToken
      const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({
        success: true,
        message: "User created successfully!!",
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  },
  loginUser: async (req, res) => {
    const { username, password } = req.body;

    //   Simple validation
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing username and/or password" });

    try {
      const user = await User.findOne({ username });

      // Check username
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect username or password" });

      // Check password
      const validPassword = await argon2.verify(user.password, password);
      if (!validPassword)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect username or password" });

      // All good
      // Return accessToken
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({
        success: true,
        message: "User logged in successfully!!",
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error!!" });
    }
  },
  checkUser: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select("-password");

      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "User not found" });

      res.json({ success: true, user });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
};

module.exports = AuthController;
