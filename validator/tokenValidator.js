const { check } = require("express-validator");

exports.checkToken = [
  check("token")
    .notEmpty()
    .withMessage("Token is required"),
];
