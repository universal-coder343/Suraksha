const express = require('express');
const router = express.Router();
const { getZones, createZone, updateZone } = require('../controllers/zonesController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, getZones)
  .post(protect, admin, createZone);

router.route('/:id')
  .put(protect, admin, updateZone);

module.exports = router;
