const express = require('express');
const controller = require('../controllers/contactController');
const { requireAdminKey } = require('../middleware/adminMiddleware');
const { asyncHandler } = require('../utils/http');
const router = express.Router();
router.post('/', asyncHandler(controller.create));
router.get('/', requireAdminKey, asyncHandler(controller.list));
router.put('/:id/status', requireAdminKey, asyncHandler(controller.updateStatus));
module.exports = router;
