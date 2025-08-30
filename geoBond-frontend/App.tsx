import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import Toast from "react-native-toast-message";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  OTPVerificationScreen,
  ResetPasswordScreen,
} from "./src/screens/Auth";
import HomeScreen from "./src/screens/HomeScreen";
import FriendsScreen from "./src/screens/FriendsScreen";
import ProfileScreen from "./src/screens/Profile/ProfileScreen";
import MapScreen from "./src/screens/MapScreen";
import FavouritesScreen from "./src/screens/FavouritesScreen";

import { ThemeProvider } from "./src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { ChatProvider } from "./src/context/ChatContext";
import FriendLocation from "./src/screens/FriendLocationHistory/FriendLocation";
import UserSearchScreen from "./src/screens/UserSearchScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import FriendRequestsScreen from "./src/screens/FriendRequestsScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import LoadingScreen from "./src/components/LoadingScreen";
import ChatListScreen from "./src/screens/ChatListScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ChatTabIcon from "./src/components/ChatTabIcon";
import ErrorBoundary from "./src/components/ErrorBoundary";

// Import your custom icon

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Wrapped components with ErrorBoundary to avoid inline functions
const UserProfileScreenWithErrorBoundary = (props: any) => (
  <ErrorBoundary>
    <UserProfileScreen {...props} />
  </ErrorBoundary>
);

const EditProfileScreenWithErrorBoundary = (props: any) => (
  <ErrorBoundary>
    <EditProfileScreen {...props} />
  </ErrorBoundary>
);

function MainTabs() {
  
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          headerShown: false,
        }}
        name="Friends"
        component={FriendsScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <ChatTabIcon color={color} size={size} />
          ),
          headerShown: false,
        }}
        name="Messages"
        component={ChatListScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerShown: false,
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false // Disable swipe back gesture
      }} 
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false // Disable swipe back gesture
      }}
    >
      <Stack.Screen name="HomeTabs" component={MainTabs} options={{headerShown: false}}  />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="FavouritesScreen" component={FavouritesScreen} />
      <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
      <Stack.Screen name="UserSearch" component={UserSearchScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreenWithErrorBoundary} />
      <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreenWithErrorBoundary} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      {/* How to pass friendId to FriendLocation */}
      <Stack.Screen name="FriendLocation" component={FriendLocation} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading, hasSeenWelcome } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen />;
  }

  // If user exists but hasn't seen welcome, show welcome screen within auth stack
  if (user && !hasSeenWelcome) {
    return (
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: false
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <NavigationContainer>
          <ThemeProvider>
            <RootNavigator />
            <Toast />
          </ThemeProvider>
        </NavigationContainer>
      </ChatProvider>
    </AuthProvider>
  );
}
