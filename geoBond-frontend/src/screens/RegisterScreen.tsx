import React, { useState } from "react";
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
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur"; // Or 'expo-blur' if you're using Expo
import { registerUser } from "../services/authService";

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'All fields are required.',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(email, password, fullName);
      if (response.message === "User registered") {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful!',
          text2: 'Your account has been created successfully.',
        });
        navigation.navigate("Login");
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: response.message || 'Something went wrong',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Error occurred during registration.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background-map-connections.png')} // Same background as Login screen
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <BlurView
            style={styles.glassPanel}
            intensity={75}
          // blurType="light"
          // reducedTransparencyFallbackColor="white"
          >
            <Text style={styles.title}>Create Account 👤</Text>
            <Text style={styles.subtitle}>Join to start sharing your location</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#FFFFFFCC"
              value={fullName}
              onChangeText={setFullName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#FFFFFFCC"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#FFFFFFCC"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
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

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.switchText}>
                Already have an account? <Text style={styles.link}>Login</Text>
              </Text>
            </TouchableOpacity>
          </BlurView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default RegisterScreen;

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
