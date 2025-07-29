import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocationUpdates } from '../hooks/useLocationUpdates';
import { AuthContext } from '../context/AuthContext';
import { locationService } from '../services/locationService';
import Toast from 'react-native-toast-message';

const MapScreen = () => {
  const { user } = useContext(AuthContext);
  const { getAllLocations, locationUpdates } = useLocationUpdates();
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  useEffect(() => {
    // Get current user's location
    const getCurrentLocation = async () => {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    // Show toast when receiving location updates
    if (locationUpdates.size > 0) {
      const locations = getAllLocations();
      if (locations.length > 0) {
        const latestLocation = locations[locations.length - 1];
        Toast.show({
          type: 'info',
          text1: 'Location Update',
          text2: `Received location from user: ${latestLocation.userId}`,
        });
      }
    }
  }, [locationUpdates]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-time Location Sharing</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Location</Text>
        {currentLocation ? (
          <Text style={styles.locationText}>
            Lat: {currentLocation.coords.latitude.toFixed(6)}
            {'\n'}Lng: {currentLocation.coords.longitude.toFixed(6)}
          </Text>
        ) : (
          <Text style={styles.noLocationText}>Getting your location...</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Users ({locationUpdates.size})</Text>
        {getAllLocations().length > 0 ? (
          getAllLocations().map((location, index) => (
            <View key={index} style={styles.locationItem}>
              <Text style={styles.userId}>User: {location.userId}</Text>
              <Text style={styles.locationText}>
                Lat: {location.lat.toFixed(6)}
                {'\n'}Lng: {location.lng.toFixed(6)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noLocationText}>No other users sharing location</Text>
        )}
      </View>

      <View style={styles.statusSection}>
        <Text style={styles.statusText}>
          Status: {locationService.isLocationTracking() ? '🟢 Tracking' : '🔴 Not Tracking'}
        </Text>
        <Text style={styles.statusText}>
          Connected Users: {locationUpdates.size}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  noLocationText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  locationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  userId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statusSection: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#2d5a2d',
    marginBottom: 5,
  },
});

export default MapScreen;