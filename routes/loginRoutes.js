const express = require('express');
const router = express.Router();
const loginControllers = require('../controllers/loginControllers');
const loginValidator = require('../validator/loginValidator');

router.route('/').post(loginValidator.authenticateCredentials, loginControllers.authenticateCredentials);

module.exports = router