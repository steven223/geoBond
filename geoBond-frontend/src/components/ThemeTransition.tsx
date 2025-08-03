import React, { useRef } from 'react';
import { StyleSheet, Animated, Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Calculate the maximum radius needed to cover the entire screen
const MAX_RADIUS = Math.sqrt(width * width + height * height);

interface ThemeTransitionProps {
  darkMode: boolean;
  buttonPosition: { x: number; y: number };
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

const ThemeTransition: React.FC<ThemeTransitionProps> = ({ 
  darkMode, 
  buttonPosition,
  isAnimating,
  onAnimationComplete
}) => {
  // Animation value for the circle radius
  const circleRadius = useRef(new Animated.Value(0)).current;
  // Animation value for opacity to fade in/out the circle
  const circleOpacity = useRef(new Animated.Value(0)).current;

  // Start animation when isAnimating changes to true
  React.useEffect(() => {
    if (isAnimating) {
      // Reset the circle to start from the button position
      circleRadius.setValue(0);
      circleOpacity.setValue(1);

      // Animate the circle expanding outward
      Animated.parallel([
        Animated.timing(circleRadius, {
          toValue: MAX_RADIUS,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(circleOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
          delay: 300,
        }),
      ]).start(() => {
        // Call the callback when animation is complete
        onAnimationComplete();
      });
    }
  }, [isAnimating, onAnimationComplete]);

  // Don't render anything if not animating
  if (!isAnimating) return null;

  return (
    <Animated.View
      style={[
        styles.circleOverlay,
        {
          backgroundColor: darkMode ? '#F8F9FA' : '#121212',
          width: circleRadius.interpolate({
            inputRange: [0, MAX_RADIUS],
            outputRange: [0, MAX_RADIUS * 2],
          }),
          height: circleRadius.interpolate({
            inputRange: [0, MAX_RADIUS],
            outputRange: [0, MAX_RADIUS * 2],
          }),
          borderRadius: MAX_RADIUS,
          opacity: circleOpacity,
          left: buttonPosition.x - MAX_RADIUS,
          top: buttonPosition.y - MAX_RADIUS,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  circleOverlay: {
    position: 'absolute',
    zIndex: 10,
  },
});

export default ThemeTransition;