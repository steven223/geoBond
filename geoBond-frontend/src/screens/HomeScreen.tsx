// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

const features = [
  { id: '1', title: 'Live Map', icon: 'map', screen: 'MapScreen' },
  { id: '2', title: 'My Friends', icon: 'people', screen: 'FriendsScreen' },
  { id: '3', title: 'Favourite Locations', icon: 'heart', screen: 'FavouritesScreen' },
  { id: '4', title: 'Profile / Settings', icon: 'settings', screen: 'ProfileScreen' },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout, user } = useContext(AuthContext);
  const [username, setUsername] = useState<string>('User');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) setUsername(storedUsername);
      } catch (err) {
        console.error('Error fetching username:', err);
      }
    };
    fetchUsername();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will stop sharing your location.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all AsyncStorage data
              await AsyncStorage.clear();
              
              // Call logout from AuthContext
              await logout();
              
              Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'You have been successfully logged out.',
              });
            } catch (error) {
              console.error('Error during logout:', error);
              Toast.show({
                type: 'error',
                text1: 'Logout Error',
                text2: 'Failed to logout. Please try again.',
              });
            }
          },
        },
      ]
    );
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const themeStyles = darkMode ? themes.dark : themes.light;

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Header with logout button */}
      <View style={styles.headerRow}>
        <Text style={[styles.header, themeStyles.text]}>
          Welcome back, {user?.fullName || username} 👋
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
            <Ionicons
              name={darkMode ? 'sunny' : 'moon'}
              size={24}
              color={darkMode ? '#facc15' : '#1e293b'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#ef4444"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feature Grid */}
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.card, themeStyles.card]}
            onPress={() => navigation.navigate(item.screen as never)}
          >
            <Ionicons
              name={item.icon as never}
              size={36}
              color={darkMode ? '#60A5FA' : '#007BFF'}
            />
            <Text style={[styles.title, themeStyles.text]}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

const themes = {
  light: {
    container: { backgroundColor: '#F9FAFB' },
    text: { color: '#1E293B' },
    card: { backgroundColor: '#ffffff' },
  },
  dark: {
    container: { backgroundColor: '#0f172a' },
    text: { color: '#F1F5F9' },
    card: { backgroundColor: '#1e293b' },
  },
}
