import { io, Socket } from 'socket.io-client';

const sockets = new Map<string, Socket>();

export const initializeSocket = (namespace = '/'): Socket => {
  const normalizedNamespace = namespace.startsWith('/')
    ? namespace
    : `/${namespace}`;

  const existingSocket = sockets.get(normalizedNamespace);

  if (existingSocket) return existingSocket;

  const socket = io(
    `${process.env.NEXT_PUBLIC_API_URL}${normalizedNamespace}`,
    {
      withCredentials: true,
      autoConnect: false,
    },
  );

  sockets.set(normalizedNamespace, socket);

  return socket;
};

export const getSocket = (namespace = '/'): Socket | null => {
  const normalizedNamespace = namespace.startsWith('/')
    ? namespace
    : `/${namespace}`;

  return sockets.get(normalizedNamespace) ?? null;
};

export const disconnectSocket = (): void => {
  for (const socket of sockets.values()) {
    socket.disconnect();
  }

  sockets.clear();
};
