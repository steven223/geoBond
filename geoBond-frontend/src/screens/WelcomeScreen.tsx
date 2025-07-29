import React, { useEffect, useState, useRef, useContext } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

export default function WelcomeScreen() {
  const [fullName, setUserName] = useState("");
  const navigation = useNavigation();
  const { user, setHasSeenWelcome } = useContext(AuthContext);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user) {
          console.log("👤 User data:", user.email);
          setUserName(user.fullName);
        } else {
          // If no user data, redirect to login
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" as never }],
          });
          return;
        }
      } catch (error) {
        console.error("❌ Error fetching user from storage:", error);
        // If error, redirect to login
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" as never }],
        });
        return;
      }
    };

    fetchUser();

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

    // Navigate after animation + delay
    const timer = setTimeout(async () => {
      if (user) {
        // Mark that user has seen welcome screen
        await setHasSeenWelcome(true);
        
        // Don't navigate here - let AuthContext handle the navigation flow
        // The AuthContext will automatically show the appropriate screen based on user state
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" as never }],
        });
      }
    }, 2500);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, user, setHasSeenWelcome]);

  // If no user, don't render anything (will redirect to login)
  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.text}>Welcome{fullName ? `, ${fullName}` : ""}!</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: 30,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  text: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
});
