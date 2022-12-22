const { check } = require("express-validator");

exports.authenticateCredentials = [
  check("email")
    .isEmail()
    .withMessage("Email format not valid")
    .notEmpty()
    .withMessage("Email is required"),
  check("password").notEmpty().withMessage("Password is required"),
];
