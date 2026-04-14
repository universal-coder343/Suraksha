const express = require('express');
const router = express.Router();
const { calculateRoute } = require('../controllers/routeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, calculateRoute);

module.exports = router;
