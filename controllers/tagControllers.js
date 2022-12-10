const prisma = require("../prisma/index");
const { validationResult } = require("express-validator");

exports.getTags = async (req, res, next) => {
  // Get all tags
  console.log("getting all tags");
};

exports.createTag = async (req, res, next) => {
    const errors = validationResult(req);

    !errors.isEmpty() && res.status(400).json({ errors: errors.array() });

    // create new tag
    try {
      const { name } = req.body;
      console.log(`adding ${name}`);
      res.status(200).json({ message: `${name} added` });
    } catch (error) {
      next(error);
    }
  };
