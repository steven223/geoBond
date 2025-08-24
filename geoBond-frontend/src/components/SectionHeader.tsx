import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionPress,
  icon,
  style,
  titleStyle,
}) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: SPACING.md,
          paddingHorizontal: SPACING.lg,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={COLORS.primary}
              style={{ marginRight: SPACING.sm }}
            />
          )}
          <Text
            style={[
              TYPOGRAPHY.h4,
              {
                color: COLORS.textPrimary,
                fontWeight: '600',
              },
              titleStyle,
            ]}
          >
            {title}
          </Text>
        </View>
        
        {subtitle && (
          <Text
            style={[
              TYPOGRAPHY.caption,
              {
                color: COLORS.textSecondary,
                marginTop: SPACING.xs,
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {actionText && onActionPress && (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
          <Text
            style={[
              TYPOGRAPHY.body2,
              {
                color: COLORS.primary,
                fontWeight: '600',
              },
            ]}
          >
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;