import * as Location from 'expo-location';
import { getSocket } from './socket';
import Toast from 'react-native-toast-message';

class LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;
  private isTracking = false;
  private currentUserId: string | null = null;

  async startLocationTracking(userId: string) {
    try {
      this.currentUserId = userId;
      
      // Check if location permission is granted
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Location Permission Required',
          text2: 'Please enable location access in settings.',
        });
        return false;
      }

      // Enable location services
      await Location.enableNetworkProviderAsync();

      // Start location tracking with more frequent updates for real-time sharing
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // 10 seconds for real-time updates
          distanceInterval: 50, // 50 meters
        },
        (location) => {
          this.sendLocationViaSocket(location);
        }
      );

      this.isTracking = true;
      console.log('📍 Real-time location tracking started');

      // Also send initial location immediately
      // const currentLocation = await Location.getCurrentPositionAsync({
      //   accuracy: Location.Accuracy.High,
      // });
      // await this.sendLocationViaSocket(currentLocation);

      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      Toast.show({
        type: 'error',
        text1: 'Location Error',
        text2: 'Failed to start location tracking.',
      });
      return false;
    }
  }

  async stopLocationTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }

    this.isTracking = false;
    this.currentUserId = null;
    console.log('📍 Location tracking stopped');
  }

  private async sendLocationViaSocket(location: Location.LocationObject) {
    try {
      if (!this.currentUserId) {
        console.warn('📍 No user ID available for location sharing');
        return;
      }

      const socket = getSocket();
      if (socket && socket.connected) {
        const locationData = {
          userId: this.currentUserId,
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
        };

        socket.emit('location:update', locationData);
        console.log('📍 Location sent via socket:', locationData);
      } else {
        console.warn('📍 Socket not connected, cannot send location');
      }
    } catch (error) {
      console.error('📍 Error sending location via socket:', error);
      Toast.show({
        type: 'error',
        text1: 'Location Update Failed',
        text2: 'Failed to update location. Please check your connection.',
      });
    }
  }

  async getCurrentLocation() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  isLocationTracking() {
    return this.isTracking;
  }

  // Method to handle incoming location updates from other users
  setupLocationListener(callback: (data: { userId: string; lat: number; lng: number }) => void) {
    const socket = getSocket();
    if (socket) {
      socket.on('location:receive', (data) => {
        console.log('📍 Received location update:', data);
        callback(data);
      });
    }
  }

  // Method to remove location listener
  removeLocationListener() {
    const socket = getSocket();
    if (socket) {
      socket.off('location:receive');
    }
  }
}

export const locationService = new LocationService(); 