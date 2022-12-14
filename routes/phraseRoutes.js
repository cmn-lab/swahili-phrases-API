const express = require("express");
const router = express.Router();
const phraseControllers = require("../controllers/phraseControllers");
const phraseValidator = require("../validator/phraseValidator");

// routes for /phrases
router
  .route("/")
  .get(phraseControllers.getPhrases)
  .post(phraseValidator.createPhrase, phraseControllers.createPhrase);

module.exports = router;