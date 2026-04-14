const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: 'Bhopal'
  },
  role: {
    type: String,
    enum: ['user', 'police', 'admin'],
    default: 'user'
  },
  settings: {
    shareLocationWhileNavigating: {
      type: Boolean,
      default: true
    },
    nightModeAutoRiskUpgrade: {
      type: Boolean,
      default: true
    },
    checkInIntervalMinutes: {
      type: Number,
      default: 2
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
