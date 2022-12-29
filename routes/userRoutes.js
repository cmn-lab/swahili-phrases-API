const express = require("express");
const router = express.Router();
const userValidator = require("../validator/userValidator");
const userControllers = require("../controllers/userControllers");
const auth = require("../auth/authenticateToken");

router
  .route("/")
  .get(auth.authenticateToken, userControllers.getUsers)
  .post(auth.authenticateToken, userValidator.createUser, userControllers.createUser);

router.route("/:user_id")
.get(auth.authenticateToken, userControllers.getUser)
.put(auth.authenticateToken, userValidator.updateUser, userControllers.updateUser);

module.exports = router;