require('dotenv').config();

const express = require("express");
const app = express();
const AUTH_PORT = process.env.AUTH_SERVER_PORT;
const cors = require("cors");
const ROOT_PATH = require("./version/version");


// Auth Routes
const loginRoutes = require("./routes/loginRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const logoutRoutes = require("./routes/logoutRoutes");

// Registering Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect Endpoints
app.use(`${ROOT_PATH}/login`, loginRoutes);
app.use(`${ROOT_PATH}/token`, tokenRoutes);
app.use(`${ROOT_PATH}/logout`, logoutRoutes);
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

// Listen for connections
app.listen(AUTH_PORT, () => {
    console.log(`Authentication Server running`)
})