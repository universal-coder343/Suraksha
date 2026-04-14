const express = require('express');
const router = express.Router();
const {
  createSOSAlert,
  getActiveAlerts,
  getSOSAlertById,
  updateLocation,
  resolveAlert,
  cancelAlert
} = require('../controllers/sosController');
const { protect, police } = require('../middleware/auth');

router.route('/')
  .post(protect, createSOSAlert)
  .get(protect, police, getActiveAlerts); // Police dashboard uses this

router.route('/:id')
  .get(protect, getSOSAlertById);

router.patch('/:id/location', protect, updateLocation);
router.patch('/:id/resolve', protect, police, resolveAlert);
router.patch('/:id/cancel', protect, cancelAlert);

module.exports = router;
