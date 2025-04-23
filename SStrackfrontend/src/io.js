  // src/context/SocketContext.js
  import React, { createContext, useContext, useEffect, useState } from 'react';
  import { io } from 'socket.io-client';

  const SocketContext = createContext();

  export const useSocket = () => {
    return useContext(SocketContext);
  };

  export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
      const newSocket = io('https://myuniversallanguages.com:9093', {
        transports: ['websocket'], // Add this line to force WebSocket transport
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket.io server');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from socket.io server:', reason);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }, []);

    return (
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
    );
  };
