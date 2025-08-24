import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../constants/theme';

interface GradientBackgroundProps {
  gradient?: keyof typeof GRADIENTS;
  colors?: string[];
  children?: React.ReactNode;
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  gradient = 'primary',
  colors,
  children,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}) => {
  const gradientColors = colors || GRADIENTS[gradient];

  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;