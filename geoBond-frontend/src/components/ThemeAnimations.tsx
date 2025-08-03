import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface ThemeAnimationsProps {
  darkMode: boolean;
  nextTheme: boolean;
  isAnimating: boolean;
  onAnimationComplete: () => void;
  buttonPosition: { x: number; y: number };
}

const ThemeAnimations: React.FC<ThemeAnimationsProps> = ({
  darkMode,
  nextTheme,
  isAnimating,
  onAnimationComplete,
  buttonPosition,
}) => {
  const sunAnimationRef = useRef<LottieView>(null);
  const moonAnimationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (isAnimating) {
      // Determine which animation to play based on the next theme
      if (!nextTheme) {
        // Going to light mode - play sun animation
        if (sunAnimationRef.current) {
          sunAnimationRef.current.play();
        }
      } else {
        // Going to dark mode - play moon animation
        if (moonAnimationRef.current) {
          moonAnimationRef.current.play();
        }
      }
    } else {
      // Reset animations when not animating
      if (sunAnimationRef.current) {
        sunAnimationRef.current.reset();
      }
      if (moonAnimationRef.current) {
        moonAnimationRef.current.reset();
      }
    }
  }, [isAnimating, nextTheme]);

  // Don't render anything if not animating
  if (!isAnimating) return null;

  return (
    <View style={styles.animationContainer}>
      {!nextTheme ? (
        // Sun animation for light mode
        <LottieView
          ref={sunAnimationRef}
          source={require('../../assets/animations/sun_animation.json')}
          style={styles.lottieView}
          loop={false}
          speed={1.2}
          onAnimationFinish={onAnimationComplete}
          autoPlay={false}
        />
      ) : (
        // Moon animation for dark mode
        <LottieView
          ref={moonAnimationRef}
          source={require('../../assets/animations/moon_animation.json')}
          style={styles.lottieView}
          loop={false}
          speed={1.2}
          onAnimationFinish={onAnimationComplete}
          autoPlay={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    left: (width - 300) / 2,  // Center horizontally
    top: (height - 300) / 2,  // Center vertically
  },
  lottieView: {
    width: '100%',
    height: '100%',
  },
});

export default ThemeAnimations;