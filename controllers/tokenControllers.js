const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

let refreshTokens = []; // Will be emptied out when server restarts FIX REQUIRED
exports.refreshTokens = refreshTokens;

exports.handleTokenRefresh = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const refreshToken = req.body.token;

      if (refreshToken == null) {
        res.status(401);
      }
      if (!refreshTokens.includes(refreshToken)) {
        res.status(403);
      }
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, user) => {
          if (error) {
            res.status(403);
          }
          const accessToken = this.generateAccessToken({
            email: user.email,
          });
          res.json({ accessToken: accessToken });
        }
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteToken = async (req, res, next) => {
    refreshTokens = refreshTokens.filter(token => token != req.body.token);
    res.status(204).json({ "message": "SUCCESS", "resultCode": 0});
}

exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
};
