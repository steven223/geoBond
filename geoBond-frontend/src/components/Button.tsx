import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { 
  COLORS, 
  BORDER_RADIUS, 
  SHADOWS, 
  SPACING, 
  TYPOGRAPHY,
  moderateScale 
} from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  testID,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const iconColor = variant === 'outline' || variant === 'ghost' 
    ? COLORS.primary 
    : COLORS.white;

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={iconColor}
          style={styles.loader}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={iconColor}
          style={styles.iconLeft}
        />
      )}
      <Text style={textStyles}>{title}</Text>
      {!loading && icon && iconPosition === 'right' && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={iconColor}
          style={styles.iconRight}
        />
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        testID={testID}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={buttonStyle}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
  },
  
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.small,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  gradient: {
    backgroundColor: 'transparent',
    ...SHADOWS.medium,
  },
  
  // Sizes
  small: {
    paddingVertical: SPACING.sm,
    minHeight: moderateScale(36),
  },
  medium: {
    paddingVertical: SPACING.md,
    minHeight: moderateScale(44),
  },
  large: {
    paddingVertical: SPACING.lg,
    minHeight: moderateScale(52),
  },
  
  // States
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body1.fontSize,
  },
  secondaryText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body1.fontSize,
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body1.fontSize,
  },
  ghostText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body1.fontSize,
  },
  gradientText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.body1.fontSize,
  },
  
  // Size text styles
  smallText: {
    fontSize: TYPOGRAPHY.body2.fontSize,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.body1.fontSize,
  },
  largeText: {
    fontSize: TYPOGRAPHY.h6.fontSize,
  },
  
  // Icon styles
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
  loader: {
    marginRight: SPACING.sm,
  },
});

export default Button;