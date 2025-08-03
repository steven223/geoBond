import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur"; // Or 'expo-blur' if you're using Expo

import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Location Permission Required',
          text2: 'Please enable location access to use all features of the app.',
        });
        return false;
      }
      return true;
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Permission Error',
        text2: 'Failed to request location permission.',
      });
      return false;
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all fields',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(email, password);
      console.log("Response:", response);

      if (response.token) {
        await login(response.user, response.token);

        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: `Welcome ${response.user.email}`,
        });

        await requestLocationPermission();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response.message || 'Invalid credentials',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background-map-connections.png')} // Your background image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Glassmorphism Panel */}
          <BlurView
            style={styles.glassPanel}
            intensity={75} // Adjust intensity value between 1-100
            tint="dark"
          >
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>Log in to continue your Geo-Bond journey</Text>

            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#FFFFFFCC" // More opaque white
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              autoComplete="email"
              // Add a subtle border on focus for better UX
              onFocus={() => { /* maybe change border color */ }}
              onBlur={() => { /* reset border color */ }}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#FFFFFFCC" // More opaque white
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoComplete="password"
                // Add a subtle border on focus for better UX
                onFocus={() => { /* maybe change border color */ }}
                onBlur={() => { /* reset border color */ }}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#FFFFFFDD"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.switchText}>
                Don't have an account? <Text style={styles.link}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </BlurView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safe: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  glassPanel: {
    backgroundColor: 'rgba(85, 84, 84, 0.73)', // Same as before, provides the blur overlay
    borderRadius: 20,
    paddingVertical: 35, // Increased vertical padding for more space
    paddingHorizontal: 25,
    width: '95%',
    maxWidth: 400,
    alignItems: 'center',
    // borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 8,
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: "#E0E0E0",
    marginBottom: 40, // More space below subtitle
    textAlign: "center",
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)', // More opaque input background
    paddingVertical: 16, // Increased padding
    paddingHorizontal: 18,
    borderRadius: 14,
    fontSize: 17, // Slightly larger font size
    marginBottom: 18, // Increased margin
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)', // More visible border
    width: "100%",
    color: '#FFFFFF', // Ensure typed text is white
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 18, // Increased margin
    width: "100%",
  },
  passwordInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)', // More opaque input background
    paddingVertical: 16, // Increased padding
    paddingHorizontal: 18,
    paddingRight: 55,
    borderRadius: 14,
    fontSize: 17, // Slightly larger font size
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)', // More visible border
    width: "100%",
    color: '#FFFFFF', // Ensure typed text is white
  },
  eyeButton: {
    position: 'absolute',
    right: 18,
    top: 16, // Adjusted for new padding
    padding: 2,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end', // Keep right alignment
    marginTop: -8, // Pull up slightly to reduce gap from password input
    marginBottom: 30, // More space before login button
  },
  forgotPasswordText: {
    color: "#FFFFFFDD",
    fontSize: 15,
    fontWeight: "500",
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Subtle text shadow for pop
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slightly less opaque than inputs, but still transparent
    paddingVertical: 18, // More padding for a bolder button
    borderRadius: 15, // Slightly more rounded
    alignItems: "center",
    marginBottom: 25, // More space below button
    width: "100%",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Clearer border
    // Added an inner shadow/glow for a more 'pressable' glass effect
    // shadowColor: "#FFFFFF", // White shadow for glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10, // Wider glow
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 19, // Larger text for emphasis
    fontWeight: "800", // Extra bold
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Subtle shadow for pop
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  switchText: {
    fontSize: 16,
    textAlign: "center",
    color: "#E0E0E0",
  },
  link: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});