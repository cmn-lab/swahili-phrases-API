const express = require('express');
const router = express.Router();
const phraseControllers = require('../controllers/phraseControllers');

// routes for /phrase
router.route('/').get(phraseControllers.getPhrases).post(phraseControllers.createPhrase);


module.exports = router;