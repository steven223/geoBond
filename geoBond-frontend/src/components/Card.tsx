import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'gradient' | 'outlined' | 'elevated';
  gradientColors?: string[];
  disabled?: boolean;
  testID?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  gradientColors = [COLORS.primary, COLORS.primaryDark],
  disabled = false,
  testID,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const content = (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );

  if (variant === 'gradient') {
    const gradientContent = (
      <LinearGradient
        colors={gradientColors}
        style={[styles.base, styles.gradient, style]}
        testID={testID}
      >
        {children}
      </LinearGradient>
    );

    if (onPress && !disabled) {
      return (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          disabled={disabled}
        >
          {gradientContent}
        </TouchableOpacity>
      );
    }

    return gradientContent;
  }

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
        style={cardStyle}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
  },
  default: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.medium,
  },
  gradient: {
    backgroundColor: 'transparent',
    ...SHADOWS.large,
  },
  outlined: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  elevated: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.large,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Card;