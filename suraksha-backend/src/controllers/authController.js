const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, phone, password, city } = req.body;

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      phone,
      password,
      city: city || 'Bhopal'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        cityName: user.city,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (user && (await user.matchPassword(password))) {
      user.lastActive = Date.now();
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        cityName: user.city,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid phone or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
