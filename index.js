const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 5000;

// config dotenv
dotenv.config();
// connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("DB is connected!");
});

app.use(cors());
app.use(express.json());

app.use("/v1/auth", authRouter);
app.use("/v1/posts", postsRouter);

app.listen(PORT, () => {
  console.log("Server is running ...");
});
