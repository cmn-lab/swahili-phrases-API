const prisma = require('../prisma/index');
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.authenticateCredentials = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }else{
        const { email } = req.body;
        // GET user by email & password
        const byEmailResult = await prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                email: true,
                password: true,
                isAdmin: true
            }
        });
        const { password } = byEmailResult;

        // Compare Passwords
        bcrypt.compare(req.body.password, password, (err, result) => {
            if(result){
                // Serialize user with JSON Web Tokens
                const user = { email: email };
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

                res.status(200).json({ accessToken: accessToken })
            }else{
                res.status(400).json({ access: false });
            }
        });
    }
  } catch (error) {
    next(error);
  }
};
