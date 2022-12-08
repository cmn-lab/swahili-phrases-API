require("dotenv").config();

const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();
const PORT = 8080;

// routes
const phraseRoutes = require("./routes/phraseRoutes");

// registering middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);

// API Versioning
const VERSION = "v1"; // API version
const ROOT = `/api/${VERSION}`; // Root endpoint

// redirect endpoints
app.use(`${ROOT}/phrase`, phraseRoutes);

// Listening for connections
app.listen(PORT, () => console.log(`Unyama upo kwenye PORT ${PORT}`));
