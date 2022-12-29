require('dotenv').config();

const express = require("express");
const app = express();
const PORT = process.env.AUTH_SERVER_PORT;
const cors = require("cors");
const ROOT_PATH = require("./version/version");


// Auth Routes
const loginRoutes = require("./routes/loginRoutes");

// Redirect Endpoints
app.use(`${ROOT_PATH}/login`, loginRoutes);

// Registering Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Listen for connections
app.listen(PORT, () => {
    console.log(`Authentication Server running`)
})