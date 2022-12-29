const prisma = require("../prisma/index");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { refreshTokens, generateAccessToken } = require("./tokenControllers");

exports.authenticateCredentials = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const { email } = req.body;

      // GET user by email & password
      const byEmailResult = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          email: true,
          password: true,
          isAdmin: true,
        },
      });
      const { password } = byEmailResult;

      // Compare Passwords
      bcrypt.compare(req.body.password, password, (err, result) => {
        if (result) {
          // Serialize user with JSON Web Tokens
          const user = { email: email };
          const accessToken = generateAccessToken(user);
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
          
          refreshTokens.push(refreshToken);

          res
            .status(200)
            .json({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
          res.status(400).json({ err });
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
