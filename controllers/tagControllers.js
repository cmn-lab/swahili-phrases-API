const prisma = require("../prisma/index");
const { validationResult } = require("express-validator");

exports.createTag = async (req, res, next) => {
  // Check for errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
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
  }
};

exports.getTags = async (req, res, next) => {
  // Get all tags
  try {
    const result = await prisma.tag.findMany();

    if (!result) {
      res.status(404).json({ errorCode: 1020, message: "Tags not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    next(error);
  }
};

