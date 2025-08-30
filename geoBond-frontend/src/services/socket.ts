import { io, Socket } from 'socket.io-client';
import Toast from 'react-native-toast-message';

const SOCKET_URL = 'http://192.168.0.193:5000'; // <-- use this IP
let socket: Socket;

export const initSocket = () => {
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false, // will connect after login
    timeout: 10000,
  });

  socket.on('connect', () => {
    console.log('🟢 Socket connected: ', socket.id);
    Toast.show({
      type: 'success',
      text1: 'Connected',
      text2: 'Real-time location sharing enabled',
    });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected');
    Toast.show({
      type: 'error',
      text1: 'Connection Lost',
      text2: 'Real-time location sharing disabled',
    });
  });

  socket.on('connect_error', (error) => {
    console.error('🔴 Socket connection error:', error);
    Toast.show({
      type: 'error',
      text1: 'Connection Error',
      text2: 'Failed to connect to location sharing service',
    });
  });

  socket.on('error', (error) => {
    console.error('🔴 Socket error:', error);
    Toast.show({
      type: 'error',
      text1: 'Socket Error',
      text2: 'Location sharing service error',
    });
  });
};

export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized');
    return null;
  }
  return socket;
};

export const isSocketConnected = () => {
  return socket && socket.connected;
};

export const setupConnectedUsersListener = (callback: (count: number) => void) => {
  if (socket) {
    socket.on('users:count', (data: { count: number }) => {
      callback(data.count);
    });
  }
};

export const removeConnectedUsersListener = () => {
  if (socket) {
    socket.off('users:count');
  }
};

// Chat-specific socket functions
export const setupChatListeners = (callbacks: {
  onMessage?: (message: any) => void;
  onTyping?: (data: { userId: string; isTyping: boolean; conversationId: string }) => void;
  onRead?: (data: { userId: string; conversationId: string; readAt: string }) => void;
  onError?: (error: { message: string }) => void;
}) => {
  if (!socket) return;

  if (callbacks.onMessage) {
    socket.on('chat:message', callbacks.onMessage);
  }
  
  if (callbacks.onTyping) {
    socket.on('chat:typing', callbacks.onTyping);
  }
  
  if (callbacks.onRead) {
    socket.on('chat:read', callbacks.onRead);
  }
  
  if (callbacks.onError) {
    socket.on('chat:error', callbacks.onError);
  }
};

export const removeChatListeners = () => {
  if (socket) {
    socket.off('chat:message');
    socket.off('chat:typing');
    socket.off('chat:read');
    socket.off('chat:error');
  }
};
