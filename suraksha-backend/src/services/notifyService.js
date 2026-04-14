const notifyPolice = (io, sosData) => {
  // Emit to 'police' room which dashboards subscribe to
  io.to('police').emit('new_sos', sosData);
};

const notifyResolved = (io, sosId) => {
  io.to('police').emit('sos_resolved', { sosId });
};

const notifyLocationUpdate = (io, sosId, location) => {
  io.to('police').emit('sos_location_update', { sosId, location });
};

const notifyCancelled = (io, sosId) => {
  io.to('police').emit('sos_cancelled', { sosId });
};

module.exports = {
  notifyPolice,
  notifyResolved,
  notifyLocationUpdate,
  notifyCancelled
};
