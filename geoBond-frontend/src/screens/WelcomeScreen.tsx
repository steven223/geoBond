import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WelcomeScreen() {
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current; // useRef to persist animation value

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          console.log("👤 User data:", user.email);
          setUserName(user.email);
        }
      } catch (error) {
        console.error("❌ Error fetching user from storage:", error);
      }
    };

    fetchUser();

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

    // Navigate after animation + delay
    const timer = setTimeout(() => {
      // Check if user exists, else redirect to Login
      if (userName) {
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeTabs" as never }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" as never }],
        });
      }
    }, 2500);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, userName]);

  // This causes the effect to fire each time userName changes,
  // which means navigation.reset might happen sooner than expected.
  // To avoid that, move navigation logic to a separate effect.

  // Revised: Better to separate fetching user and navigation timing:

  /*
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserName(user.email);
        }
      } catch (error) {}
    };
    fetchUser();
    Animated.spring(scaleAnim, {...}).start();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userName) navigation.reset({routes: [{name: "HomeTabs"}], index: 0});
      else navigation.reset({routes: [{name: "Login"}], index: 0});
    }, 2500);
    return () => clearTimeout(timer);
  }, [userName]);
  */

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.text}>Welcome{userName ? `, ${userName}` : ""}!</Text>
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
