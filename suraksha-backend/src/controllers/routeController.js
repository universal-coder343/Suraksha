const { getSafeRoute } = require('../services/routeEngine');
const Zone = require('../models/Zone');

const calculateRoute = async (req, res) => {
  try {
    const { from, to, city = 'Jaipur' } = req.query;
    if (!from || !to) {
      return res.status(400).json({ message: 'Missing from/to parameters' });
    }

    const [fromLat, fromLng] = from.split(',').map(Number);
    const [toLat, toLng] = to.split(',').map(Number);

    const zones = await Zone.find({ city }); 

    const route = await getSafeRoute(fromLat, fromLng, toLat, toLng, zones);
    
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  calculateRoute
};
