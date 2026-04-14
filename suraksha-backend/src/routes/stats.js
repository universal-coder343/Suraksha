const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { protect, police } = require('../middleware/auth');

router.get('/', protect, police, getDashboardStats);

module.exports = router;
