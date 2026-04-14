const mongoose = require('mongoose');

const policeStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: String,
  city: {
    type: String,
    required: true
  },
  location: {
    lat: Number,
    lng: Number
  },
  jurisdiction: [[Number]] // Array of [lat, lng] pairs defining their zone
}, { timestamps: true });

module.exports = mongoose.model('PoliceStation', policeStationSchema);
