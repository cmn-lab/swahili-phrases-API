const prisma = require("../prisma/index");
const { validationResult } = require("express-validator");

exports.getTags = async (req, res, next) => {
  // Get all tags
  console.log("getting all tags");
};

exports.createTag = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);

  !errors.isEmpty() && res.status(400).json({ errors: errors.array() });

  // Create new tag
  try {
    const { name } = req.body;
    const data = { name };
    const result = await prisma.tag.create({ data });
    console.log(result);
    result &&
      res
        .status(200)
        .json({ message: "SUCCESS", resultCode: 0, result: result });
  } catch (error) {
    next(error);
  }
};
