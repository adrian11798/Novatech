const express = require('express');
const controller = require('../controllers/calculatorController');
const { requireAdminKey } = require('../middleware/adminMiddleware');
const { asyncHandler } = require('../utils/http');
const router = express.Router();
router.post('/', asyncHandler(controller.calculate));
router.get('/', requireAdminKey, asyncHandler(controller.list));
module.exports = router;
