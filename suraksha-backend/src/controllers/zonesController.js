const Zone = require('../models/Zone');

const getZones = async (req, res) => {
  try {
    const city = req.query.city || 'Jaipur';
    const zones = await Zone.find({ city });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createZone = async (req, res) => {
  try {
    const newZone = await Zone.create(req.body);
    res.status(201).json(newZone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateZone = async (req, res) => {
  try {
    const zone = await Zone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!zone) return res.status(404).json({ message: 'Zone not found' });
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getZones,
  createZone,
  updateZone
};
