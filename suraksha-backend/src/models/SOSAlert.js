const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  userPhone: String,
  status: {
    type: String,
    enum: ['active', 'resolved', 'cancelled'],
    default: 'active'
  },
  triggerMethod: {
    type: String,
    enum: ['shake', 'power_button', 'manual', 'auto_checkin']
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: String
  },
  liveLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date
  },
  nearestPoliceStation: {
    name: String,
    phone: String,
    distanceKm: Number
  },
  contactsAlerted: [{
    name: String,
    phone: String,
    notifiedAt: { type: Date, default: Date.now }
  }],
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date
}, { timestamps: true });

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
