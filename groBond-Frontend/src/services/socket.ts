import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Replace with your local IP or server
let socket: Socket;

export const initSocket = () => {
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false, // will connect after login
  });

  socket.on('connect', () => {
    console.log('🟢 Socket connected: ', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected');
  });
};

export const getSocket = () => socket;
