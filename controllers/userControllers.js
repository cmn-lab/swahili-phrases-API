const prisma = require("../prisma/index");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const hashids = require("../hashes/hashIds");

exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { firstName, lastName, email, password, isAdmin } = req.body;

      try {
        // Encrypt password and Create new User
        bcrypt.hash(password, SALT_ROUNDS).then(async (hash) => {
          const result = await prisma.user.create({
            data: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hash,
              isAdmin: isAdmin,
            },
          });
          if (result) {
            res.status(200).json({
              message: "SUCCESS",
              resultCode: 0,
              result: result,
            });
          } else {
            res.status(400).json({
              errorCode: 1008,
              message: "Unable to Create New User",
            });
          }
        });
      } catch (error) {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const params = req.query;
    console.log(req.user)

    if (Object.keys(params).length === 0 && params.constructor === Object) {
      // No params, GET All Users
      try {
        const result = await prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isAdmin: true,
          },
        });
        if (!result) {
          res.status(404).json({ errorCode: 1020, message: "No user found" });
        } else {
          let formattedResult = [];

          // Format result
          result.forEach((element) => {
            const hashedId = hashids.encode(element.id);
            const formattedObject = {
              id: hashedId,
              firstName: element.firstName,
              lastName: element.lastName,
              email: element.email,
              isAdmin: element.isAdmin,
            };
            formattedResult.push(formattedObject);
          });
          res.status(200).json(formattedResult);
        }
      } catch (error) {
        next(error);
      }
    } else {
      // Params Exist, GET Users based on filter
      const { query } = params;
      const { isAdmin } = JSON.parse(query);

      if (isAdmin) {
        // GET all Admins
        try {
          const result = await prisma.user.findMany({
            where: {
              isAdmin: true,
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              isAdmin: true,
            },
          });
          if (!result) {
            res
              .status(404)
              .json({ errorCode: 1020, message: "No Admin found" });
          } else {
            let formattedResult = [];

            // Format result
            result.forEach((element) => {
              const hashedId = hashids.encode(element.id);
              const formattedObject = {
                id: hashedId,
                firstName: element.firstName,
                lastName: element.lastName,
                email: element.email,
                isAdmin: element.isAdmin,
              };
              formattedResult.push(formattedObject);
            });
            res.status(200).json(formattedResult);
          }
        } catch (error) {
          next(error);
        }
      } else {
        // GET Normal Users
        try {
          const result = await prisma.user.findMany({
            where: {
              isAdmin: false,
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              isAdmin: true,
            },
          });
          if (!result) {
            res.status(404).json({ errorCode: 1020, message: "No user found" });
          } else {
            let formattedResult = [];

            // Format result
            result.forEach((element) => {
              const hashedId = hashids.encode(element.id);
              const formattedObject = {
                id: hashedId,
                firstName: element.firstName,
                lastName: element.lastName,
                email: element.email,
                isAdmin: element.isAdmin,
              };
              formattedResult.push(formattedObject);
            });
            res.status(200).json(formattedResult);
          }
        } catch (error) {
          next(error);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  // GET Specific User by ID
  try {
    const { user_id } = req.params;
    const result = await prisma.user.findUnique({
      where: {
        id: parseInt(hashids.decode(user_id)),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isAdmin: true,
      },
    });
    if (result) {
      // Format result
      const hashedId = hashids.encode(result.id);
      const formattedResult = {
        id: hashedId,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        isAdmin: result.isAdmin,
      };
      res.status(200).json(formattedResult);
    } else {
      res.send(404).json({ errorCode: 1020, message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { user_id } = req.params;
      const { firstName, lastName, email, isAdmin } = req.body;
      const newData = {
        firstName,
        lastName,
        email,
        isAdmin,
      };
      try {
        const result = await prisma.user.update({
          where: {
            id: parseInt(hashids.decode(user_id)),
          },
          data: newData,
          select: {
            firstName: true,
            lastName: true,
            email: true,
            isAdmin: true,
          },
        });
        if (result) {
          res
            .status(200)
            .json({ message: "SUCCESS", resultCode: 0, result: result });
        } else {
          res
            .status(400)
            .json({ errorCode: 1008, message: "Unable to update data." });
        }
      } catch (error) {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};
