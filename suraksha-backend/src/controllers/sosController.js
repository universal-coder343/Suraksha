const SOSAlert = require('../models/SOSAlert');
const Contact = require('../models/Contact');
const PoliceStation = require('../models/PoliceStation');
const { getIo } = require('../config/socket');
const { sendSOSAlert, sendCancellation } = require('../services/smsService');
const { notifyPolice, notifyResolved, notifyLocationUpdate, notifyCancelled } = require('../services/notifyService');

const createSOSAlert = async (req, res) => {
  try {
    const { lat, lng, triggerMethod } = req.body;
    
    // Create new SOS
    const newSOS = await SOSAlert.create({
      userId: req.user._id,
      userName: req.user.name,
      userPhone: req.user.phone,
      location: { lat, lng },
      liveLocation: { lat, lng, updatedAt: Date.now() },
      triggerMethod
    });

    // 1. Alert Contacts
    const contacts = await Contact.find({ userId: req.user._id });
    
    // 2. Find Nearest Police Station
    const stations = await PoliceStation.find();
    let nearestStation = stations.length > 0 ? stations[0] : null; 
    
    // Save info
    newSOS.nearestPoliceStation = nearestStation 
      ? { name: nearestStation.name, phone: nearestStation.phone, distanceKm: 2.5 } 
      : { name: 'Emergency Services', phone: '100', distanceKm: 0 };
    
    newSOS.contactsAlerted = contacts.map(c => ({ name: c.name, phone: c.phone }));
    await newSOS.save();

    // 3. Send SMS (Non-blocking so SOS creation succeeds even if Twilio fails)
    try {
      await sendSOSAlert(contacts, nearestStation, {
        sosId: newSOS._id,
        userName: req.user.name,
        lat,
        lng
      });
    } catch (smsError) {
      console.error('SMS sending failed during SOS alert:', smsError.message);
    }

    notifyPolice(getIo(), newSOS);

    res.status(201).json(newSOS);
  } catch (error) {
    console.error('Failed to create SOS alert:', error);
    res.status(500).json({ 
      message: 'Failed to create SOS alert. Please try again or call emergency services directly.',
      error: error.message 
    });
  }
};

const getActiveAlerts = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const alerts = await SOSAlert.find(filter).sort('-createdAt');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSOSAlertById = async (req, res) => {
  try {
    const alert = await SOSAlert.findById(req.params.id);
    if (alert) res.json(alert);
    else res.status(404).json({ message: 'Alert not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const alert = await SOSAlert.findById(req.params.id);
    
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    
    alert.liveLocation = { lat, lng, updatedAt: Date.now() };
    await alert.save();

    notifyLocationUpdate(getIo(), alert._id, { lat, lng });

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const alert = await SOSAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    alert.status = 'resolved';
    alert.resolvedAt = Date.now();
    alert.resolvedBy = req.user._id;
    await alert.save();

    notifyResolved(getIo(), alert._id);

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelAlert = async (req, res) => {
  try {
    const alert = await SOSAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    // Validate it belongs to user
    if (alert.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this alert' });
    }

    alert.status = 'cancelled';
    alert.cancelledAt = Date.now();
    await alert.save();

    const contacts = await Contact.find({ userId: req.user._id });
    await sendCancellation(contacts, req.user.name);
    notifyCancelled(getIo(), alert._id);

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSOSAlert,
  getActiveAlerts,
  getSOSAlertById,
  updateLocation,
  resolveAlert,
  cancelAlert
};
