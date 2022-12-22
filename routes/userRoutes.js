const express = require("express");
const router = express.Router();
const userValidator = require("../validator/userValidator");
const userControllers = require("../controllers/userControllers");

router
  .route("/")
  .get(userControllers.getUsers)
  .post(userValidator.createUser, userControllers.createUser);

router.route("/:user_id")
.get(userControllers.getUser)
.put(userValidator.updateUser, userControllers.updateUser);

module.exports = router;