import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (namespace = '/'): Socket => {
  if (socket) return socket;

  socket = io(`${process.env.NEXT_PUBLIC_API_URL}${namespace}`, {
    withCredentials: true,
    autoConnect: false,
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
