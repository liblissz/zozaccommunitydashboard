// import { io } from 'socket.io-client';

// const socket = io('http://localhost:8000', {
//   transports: ['websocket'],
//   withCredentials: true,
// });

// socket.on('connect', () => {
//   console.log('✅ Socket connected:', socket.id);
// });

// export default socket;

import { io } from 'socket.io-client';

const socket = io('http://localhost:8000', {
  transports: ['websocket'], // Ensure websocket transport
  withCredentials: false, // Set to false if you're not using cookies
  reconnectionAttempts: 5,
  timeout: 10000, // 10 seconds timeout
});

socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ Socket connection error:', err.message);
});

export default socket;
