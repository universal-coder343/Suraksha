const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    enum: ['Mom', 'Sister', 'Friend', 'Colleague', 'Other']
  },
  isOnline: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
