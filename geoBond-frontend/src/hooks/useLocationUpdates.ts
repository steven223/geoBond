import { useState, useEffect } from 'react';
import { locationService } from '../services/locationService';

interface LocationUpdate {
  userId: string;
  lat: number;
  lng: number;
  timestamp?: number;
}

export const useLocationUpdates = () => {
  const [locationUpdates, setLocationUpdates] = useState<Map<string, LocationUpdate>>(new Map());

  useEffect(() => {
    // Setup listener for incoming location updates
    locationService.setupLocationListener((data: LocationUpdate) => {
      setLocationUpdates(prev => {
        const newMap = new Map(prev);
        newMap.set(data.userId, {
          ...data,
          timestamp: Date.now(),
        });
        return newMap;
      });
    });

    // Cleanup listener on unmount
    return () => {
      locationService.removeLocationListener();
    };
  }, []);

  const getLocationForUser = (userId: string): LocationUpdate | undefined => {
    return locationUpdates.get(userId);
  };

  const getAllLocations = (): LocationUpdate[] => {
    return Array.from(locationUpdates.values());
  };

  const clearLocations = () => {
    setLocationUpdates(new Map());
  };

  return {
    locationUpdates,
    getLocationForUser,
    getAllLocations,
    clearLocations,
  };
}; 