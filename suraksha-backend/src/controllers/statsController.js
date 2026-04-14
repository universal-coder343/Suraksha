const SOSAlert = require('../models/SOSAlert');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeAlerts = await SOSAlert.countDocuments({ status: 'active' });
    const resolvedToday = await SOSAlert.countDocuments({ 
      status: 'resolved',
      resolvedAt: { $gte: today }
    });
    const totalAlerts = await SOSAlert.countDocuments();
    
    // Mocking response time for demo purposes unless calculating
    const avgResponseTimeMinutes = 4.2; 
    const citiesCovered = 1; // Bhopal setup by default

    // Zone risk analysis mock
    const alertsByZoneRisk = {
      red: Math.floor(totalAlerts * 0.6),
      yellow: Math.floor(totalAlerts * 0.3),
      green: Math.floor(totalAlerts * 0.1)
    };

    res.json({
      activeAlerts,
      resolvedToday,
      totalAlerts,
      avgResponseTimeMinutes,
      citiesCovered,
      alertsByZoneRisk
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
