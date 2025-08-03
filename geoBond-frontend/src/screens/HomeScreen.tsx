import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Toast from 'react-native-toast-message';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import ThemeAnimations from '../components/ThemeAnimations';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Features for the home screen grid
const features = [
  { 
    id: '1', 
    title: 'Live Map', 
    description: 'Track locations in real-time',
    icon: 'map', 
    screen: 'MapScreen', 
    colors: ['#4361EE', '#3A0CA3']
  },
  { 
    id: '2', 
    title: 'My Friends', 
    description: 'Connect with your network',
    icon: 'people', 
    screen: 'FriendsScreen', 
    colors: ['#4CC9F0', '#4361EE']
  },
  { 
    id: '3', 
    title: 'Favorite Places', 
    description: 'Your saved locations',
    icon: 'heart', 
    screen: 'FavouritesScreen', 
    colors: ['#F72585', '#B5179E']
  },
  { 
    id: '4', 
    title: 'Profile', 
    description: 'Manage your account',
    icon: 'person', 
    screen: 'ProfileScreen', 
    colors: ['#7209B7', '#560BAD']
  },
];

//declare darkmode as any type
const GeometricBackground = ({ darkMode }: { darkMode: any }) => {
  const bgColor = darkMode ? '#121212' : '#F8F9FA';
  const patternColor = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
  
  return (
    <View style={[styles.patternContainer, { backgroundColor: bgColor }]}>
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Abstract connection lines */}
        <Path
          d={`M0,${height * 0.3} C${width * 0.3},${height * 0.5} ${width * 0.6},${height * 0.2} ${width},${height * 0.4}`}
          stroke={patternColor}
          strokeWidth="1"
          fill="none"
        />
        <Path
          d={`M0,${height * 0.6} C${width * 0.4},${height * 0.8} ${width * 0.7},${height * 0.5} ${width},${height * 0.7}`}
          stroke={patternColor}
          strokeWidth="1"
          fill="none"
        />
        
        {/* Connection dots */}
        {Array.from({ length: 15 }).map((_, i) => {
          const cx = Math.random() * width;
          const cy = Math.random() * height;
          const r = Math.random() * 2 + 1;
          
          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={patternColor}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { logout, user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [nextTheme, setNextTheme] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [themeButtonPosition, setThemeButtonPosition] = useState({ x: width - 50, y: 80 });
  
  // Use the theme context if available
  const themeContext = useContext(useTheme);
  
  useEffect(() => {
    // Set dark mode based on theme context if available
    if (themeContext) {
      setDarkMode(themeContext?.theme?.mode === 'dark');
      setNextTheme(themeContext?.theme?.mode === 'dark');
    }
  }, [themeContext]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      Toast.show({
        type: 'info',
        text1: 'Logging Out',
        text2: 'You will be logged out and location sharing will stop.',
        autoHide: false,
        onPress: () => Toast.hide(),
        props: {
          confirmButtonText: 'Logout Now',
          onConfirm: async () => {
            await logout();
            Toast.show({
              type: 'success',
              text1: 'Logged Out',
              text2: 'You have been successfully logged out.',
            });
          }
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Error',
        text2: 'Failed to logout. Please try again.',
      });
    }
  };

  // Function to measure the theme button position
  const measureThemeButton = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    setThemeButtonPosition({ x: pageX, y: pageY });
  };

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    // Set the next theme (opposite of current)
    setNextTheme(!darkMode);
    // Start the animation
    setIsAnimating(true);
    // The actual theme change will happen after animation completes
  };

  // Function to complete the theme change after animation
  const completeThemeChange = () => {
    setDarkMode(nextTheme);
    setIsAnimating(false);
    if (themeContext) {
      themeContext.toggleTheme();
    }
  };

  // Render a single feature card
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.cardWrapper}
      onPress={() => navigation.navigate(item.screen)}
    >
      <LinearGradient
        colors={item.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardIconContainer}>
          <Ionicons
            name={item.icon}
            size={32}
            color="#FFFFFF"
          />
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const textColor = darkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = darkMode ? '#E2E8F0' : '#64748B';

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      
      {/* Geometric background */}
      <GeometricBackground darkMode={darkMode} />

      {/* Blur overlay */}
      <BlurView
        intensity={10}
        tint={darkMode ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Theme animations */}
      <ThemeAnimations 
        darkMode={darkMode}
        nextTheme={nextTheme}
        buttonPosition={themeButtonPosition}
        isAnimating={isAnimating}
        onAnimationComplete={completeThemeChange}
      />

      <View style={styles.container}>
        {/* Header with user info and action buttons */}
        <View style={styles.headerRow}>
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user?.fullName?.[0] || 'U'}</Text>
            </View>
            <View>
              <Text style={[styles.welcomeText, { color: subtextColor }]}>Welcome back,</Text>
              <Text style={[styles.headerName, { color: textColor }]}>
                {user?.fullName || 'User'} 👋
              </Text>
            </View>
          </View>
          
          <View style={styles.headerButtons}>
            {/* Dark/Light mode toggle button */}
            <TouchableOpacity 
              onPress={toggleTheme} 
              style={styles.headerButton}
              onLayout={measureThemeButton}
            >
              <Ionicons
                name={darkMode ? 'sunny' : 'moon'}
                size={24}
                color={darkMode ? '#F59E0B' : '#6366F1'}
              />
            </TouchableOpacity>
            
            {/* Logout button */}
            <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color="#EF4444"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* App title and tagline */}
        <View style={styles.titleContainer}>
          <Text style={[styles.appTitle, { color: textColor }]}>GeoBond</Text>
          <Text style={[styles.appTagline, { color: subtextColor }]}>Connect through location</Text>
        </View>

        {/* Feature Grid */}
        <FlatList
          data={features}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  appTagline: {
    fontSize: 16,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: 44,  // Fixed width to match the ThemeTransition button
    height: 44, // Fixed height to match the ThemeTransition button
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    height: 160,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
