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
      const user = { firstName, lastName, email, password, isAdmin}
      try {
        // Create new user
        const result = await prisma.user.create({ data: user });
        if(result){
            res.status(200).json({ "message": "SUCCESS", "resultCode": 0, result: result })
        }
      } catch (error) {
        next(error)
      }
    }
  } catch (error) { 
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
    try {
        const params = req.query;
        console.log(params);
        if(Object.keys(params).length === 0 && params.constructor === Object){
            // No params, GET All Users

        }else{
            // Params Exist, GET Users based on filter
            const { query } = params;
            const {isAdmin} = JSON.parse(query);
            
            if(isAdmin){
                // GET all Admins

            }else{
                // GET Normal Users

            }
        }
        res.status(200).json({ "message": "ok"})
    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
};
