const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  risk: {
    type: String,
    enum: ['red', 'yellow', 'green'],
    required: true
  },
  weight: {
    type: Number,
    default: 0
  },
  polygon: [[Number]], // Array of [lat, lng] pairs
  incidentCount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);
