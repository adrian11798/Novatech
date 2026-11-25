const express = require('express');
const controller = require('../controllers/authController');
const { asyncHandler } = require('../utils/http');
const router = express.Router();
router.post('/register', asyncHandler(controller.register));
router.post('/login', asyncHandler(controller.login));
module.exports = router;
