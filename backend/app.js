const express = require('express');
const http = require('http');
const session = require('express-session');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust this to your client's URL
    methods: ["GET", "POST"],
  },
});


const sessionMiddleware = session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
});

// Use session middleware for express
app.use(sessionMiddleware);

// Extend session to socket.io
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('join room', (roomId) => {
    if (!roomId) {
      // Generate or select a random room ID
      roomId = 'someRandomRoomId'; // This should be more sophisticated in a real app
    }
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('chat message', (msg, roomId) => {
    io.to(roomId).emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
