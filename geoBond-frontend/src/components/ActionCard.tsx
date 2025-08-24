import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Typography from './Typography';
import { 
  COLORS, 
  BORDER_RADIUS, 
  SHADOWS, 
  SPACING, 
  scale,
  SCREEN_DIMENSIONS 
} from '../constants/theme';

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'default' | 'gradient' | 'outlined';
  gradientColors?: string[];
  iconColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  variant = 'default',
  gradientColors = [COLORS.primary, COLORS.primaryDark],
  iconColor,
  disabled = false,
  style,
  testID,
}) => {
  const cardWidth = (SCREEN_DIMENSIONS.width - (SPACING.lg * 3)) / 2;
  
  const cardStyle = [
    styles.base,
    { width: cardWidth },
    disabled && styles.disabled,
    style,
  ];

  const getIconColor = () => {
    if (iconColor) return iconColor;
    return variant === 'gradient' ? COLORS.white : COLORS.primary;
  };

  const getTitleColor = () => {
    return variant === 'gradient' ? 'white' : 'textPrimary';
  };

  const getSubtitleColor = () => {
    return variant === 'gradient' ? 'white' : 'textSecondary';
  };

  const renderContent = () => (
    <View style={styles.content}>
      <View style={[
        styles.iconContainer,
        variant === 'gradient' && styles.gradientIconContainer
      ]}>
        <Ionicons
          name={icon}
          size={scale(28)}
          color={getIconColor()}
        />
      </View>
      
      <Typography
        variant="h6"
        color={getTitleColor() as keyof typeof COLORS}
        align="center"
        style={styles.title}
        numberOfLines={2}
      >
        {title}
      </Typography>
      
      {subtitle && (
        <Typography
          variant="caption"
          color={getSubtitleColor() as keyof typeof COLORS}
          align="center"
          numberOfLines={2}
        >
          {subtitle}
        </Typography>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        testID={testID}
      >
        <LinearGradient
          colors={gradientColors}
          style={[cardStyle, styles.gradient]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        cardStyle,
        variant === 'outlined' ? styles.outlined : styles.default,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
    minHeight: scale(120),
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
  disabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: COLORS.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  gradientIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    marginBottom: SPACING.xs,
  },
});

export default ActionCard;