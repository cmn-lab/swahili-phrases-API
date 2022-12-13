const { check } = require('express-validator');

exports.createPhrase = [
  check("text")
    .notEmpty()
    .withMessage("Phrase is required")
    .isLength({ min: 4 })
    .withMessage("At least 4 characters are required"),
];