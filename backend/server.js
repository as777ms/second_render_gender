const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

// Initialize Express
const app = express();

// Allow CORS
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// In-memory message storage
let messages = [{ text: 'Hello', timestamp: '12:00 PM' }];

// Endpoint to get all messages
app.get('/messages', (req, res) => {
  console.log('Serving messages:', messages); // Log messages being served
  res.json(messages); // Serve the messages array
});

// Start HTTP server
const server = app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend's origin
    methods: ['GET', 'POST'],
  },
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for new messages
  socket.on('sendMessage', (message) => {
    messages.push(message); // Save the new message to the in-memory storage
    console.log('New message received and added to storage:', message); // Log the new message
    console.log('Updated messages array:', messages); // Log the updated array
    io.emit('newMessage', message); // Broadcast the new message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
