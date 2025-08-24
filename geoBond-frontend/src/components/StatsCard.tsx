import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  compact?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconColor = COLORS.primary,
  backgroundColor = COLORS.white,
  style,
  compact = false,
}) => {
  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius: BORDER_RADIUS.lg,
          padding: compact ? SPACING.md : SPACING.lg,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: compact ? 80 : 100,
          flex: 1,
          marginHorizontal: SPACING.xs,
        },
        SHADOWS.medium,
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={compact ? 24 : 32}
          color={iconColor}
          style={{ marginBottom: SPACING.sm }}
        />
      )}
      
      <Text
        style={[
          compact ? TYPOGRAPHY.h5 : TYPOGRAPHY.h3,
          {
            color: COLORS.textPrimary,
            fontWeight: '700',
            marginBottom: SPACING.xs,
          },
        ]}
      >
        {value}
      </Text>
      
      <Text
        style={[
          compact ? TYPOGRAPHY.caption : TYPOGRAPHY.body2,
          {
            color: COLORS.textSecondary,
            textAlign: 'center',
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

export default StatsCard;