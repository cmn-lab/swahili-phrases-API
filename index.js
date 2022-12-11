require("dotenv").config();

const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();
const PORT = 8080;

// routes
const phraseRoutes = require("./routes/phraseRoutes");
const tagRoutes = require("./routes/tagRoutes");

// registering middleware
app.use(cors());
// app.use(cookieParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Versioning
const VERSION = "v1"; // API version
const ROOT = `/api/${VERSION}`; // Root endpoint

// Redirect Endpoints
app.use(`${ROOT}/phrases`, phraseRoutes);
app.use(`${ROOT}/tags`, tagRoutes);
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
    console.log(`Unyama upo kwenye PORT ${PORT}`);
});
