const express = require('express');
const router = express.Router();
const tagControllers = require('../controllers/tagControllers');
const tagValidator = require('../validator/tagValidator');

// Routes for /tag
router.route('/').get(tagControllers.getTags).post(tagValidator.createTag, tagControllers.createTag);

module.exports = router