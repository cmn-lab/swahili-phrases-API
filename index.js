require("dotenv").config();

const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();
const PORT = 8080 || process.env.SERVER_PORT;
const ROOT_PATH = require("./version/version");

// routes
const phraseRoutes = require("./routes/phraseRoutes");
const tagRoutes = require("./routes/tagRoutes");
const userRoutes = require("./routes/userRoutes");

// registering middleware
app.use(cors());
// app.use(cookieParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect Endpoints
app.use(`${ROOT_PATH}/phrases`, phraseRoutes);
app.use(`${ROOT_PATH}/tags`, tagRoutes);
app.use(`${ROOT_PATH}/users`, userRoutes);
app.all("*", (req, res, next) => {
  const err = new Error("URL not found!");
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: 0,
    message: err.message,
    stack: err.stack,
  });
});

// Listening for connections
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} 🎉`);
});
