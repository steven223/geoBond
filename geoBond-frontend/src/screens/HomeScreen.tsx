// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const features = [
  { id: '1', title: 'Live Map', icon: 'map', screen: 'MapScreen' },
  { id: '2', title: 'My Friends', icon: 'people', screen: 'FriendsScreen' },
  { id: '3', title: 'Favourite Locations', icon: 'heart', screen: 'FavouritesScreen' },
  { id: '4', title: 'Profile / Settings', icon: 'settings', screen: 'ProfileScreen' },
];

const HomeScreen = () => {
  const navigation = useNavigation();
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

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const themeStyles = darkMode ? themes.dark : themes.light;

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Header with toggle */}
      <View style={styles.headerRow}>
        <Text style={[styles.header, themeStyles.text]}>
          Welcome back, {username} 👋
        </Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={darkMode ? 'sunny' : 'moon'}
            size={28}
            color={darkMode ? '#facc15' : '#1e293b'}
          />
        </TouchableOpacity>
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

  // Themes
  // light: {
  //   container: {
  //     backgroundColor: '#F9FAFB',
  //   },
  //   text: {
  //     color: '#1E293B',
  //   },
  //   card: {
  //     backgroundColor: '#ffffff',
  //   },
  // },
  // dark: {
  //   container: {
  //     backgroundColor: '#0f172a',
  //   },
  //   text: {
  //     color: '#F1F5F9',
  //   },
  //   card: {
  //     backgroundColor: '#1e293b',
  //   },
  // },
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
