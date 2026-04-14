const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For dev, any origin. Update for prod.
      methods: ['GET', 'POST', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Allow police dashboard to subscribe to police room for alerts
    socket.on('join_police_room', () => {
      socket.join('police');
      console.log(`Socket ${socket.id} joined police room`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = initSocket;
module.exports.getIo = getIo;
