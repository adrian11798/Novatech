const express = require('express');
const controller = require('../controllers/articleController');
const { asyncHandler } = require('../utils/http');
const router = express.Router();
router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.get));
module.exports = router;
