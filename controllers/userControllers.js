const prisma = require("../prisma/index");
const { validationResult } = require("express-validator");

exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { firstName, lastName, email, password, isAdmin } = req.body;
      // Deal with password encryption b4 creating new user
      const user = { firstName, lastName, email, password, isAdmin };
      try {
        // Create new user
        const result = await prisma.user.create({ data: user });
        if (result) {
          res
            .status(200)
            .json({ message: "SUCCESS", resultCode: 0, result: result });
        }
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
        res.status(200).json(result);
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
          res.status(200).json(result);
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
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    }
    res.status(200).json({ message: "ok" });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  // GET Specific User by ID
  try {
    const { user_id } = req.params;
    console.log(typeof user_id);
    const result = await prisma.user.findUnique({
      where: {
        id: parseInt(user_id),
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
      res.status(200).json({ result });
    } else {
      res.send(404).json({ errorCode: 1020, message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
    // UPDATE user data
try {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
    }else{
        const { user_id } = req.params;
        const { firstName, lastName, email, isAdmin } = req.body;
        const newData = {
            firstName, lastName, email, isAdmin
        };
        try {
            const result = await prisma.user.update({
              where: {
                id: parseInt(user_id),
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
	
}
};
