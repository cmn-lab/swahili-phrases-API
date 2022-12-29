require('dotenv').config();

const express = require("express");
const app = express();
const AUTH_PORT = process.env.AUTH_SERVER_PORT;
const cors = require("cors");
const ROOT_PATH = require("./version/version");


// Auth Routes
const loginRoutes = require("./routes/loginRoutes");
const tokenRoutes = require("./routes/tokenRoutes");

// Registering Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect Endpoints
app.use(`${ROOT_PATH}/login`, loginRoutes);
app.use(`${ROOT_PATH}/token`, tokenRoutes);

// Listen for connections
app.listen(AUTH_PORT, () => {
    console.log(`Authentication Server running`)
})