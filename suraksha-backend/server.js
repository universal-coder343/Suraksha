require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');

const connectDB = require('./src/config/db');
const initSocket = require('./src/config/socket');
const { errorHandler } = require('./src/middleware/errorHandler');

// Route Imports
const authRoutes = require('./src/routes/auth');
const sosRoutes = require('./src/routes/sos');
const contactsRoutes = require('./src/routes/contacts');
const zonesRoutes = require('./src/routes/zones');
const routeRoutes = require('./src/routes/route');
const policeRoutes = require('./src/routes/police');
const statsRoutes = require('./src/routes/stats');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Load Routes
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/route', routeRoutes);
app.use('/api/police', policeRoutes);
app.use('/api/stats', statsRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Suraksha API running...' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
