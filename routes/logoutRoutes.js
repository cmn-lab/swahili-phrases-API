const express = require("express");
const router = express.Router();
const tokenControllers = require("../controllers/tokenControllers");

router.route('/').delete(tokenControllers.deleteToken);

module.exports = router