const { check } = require('express-validator');

exports.createTag = [
  check("name")
    .notEmpty()
    .withMessage("Tag name is required")
    .isLength({ min: 4 })
    .withMessage("At least 4 characters are required"),
];