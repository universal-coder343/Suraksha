const express = require('express');
const router = express.Router();
const { getNearestPoliceStation } = require('../controllers/policeController');
const { protect } = require('../middleware/auth');

router.get('/nearest', protect, getNearestPoliceStation);

module.exports = router;
