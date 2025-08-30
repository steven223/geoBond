import { useState, useEffect } from 'react';
import { setupConnectedUsersListener, removeConnectedUsersListener } from '../services/socket';

export const useConnectedUsers = () => {
  const [connectedUsersCount, setConnectedUsersCount] = useState<number>(0);

  useEffect(() => {
    const handleConnectedUsersUpdate = (count: number) => {
      setConnectedUsersCount(count);
    };

    setupConnectedUsersListener(handleConnectedUsersUpdate);

    return () => {
      removeConnectedUsersListener();
    };
  }, []);

  return { connectedUsersCount };
};