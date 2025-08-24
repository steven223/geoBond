import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS, GRADIENTS } from '../constants/theme';

interface QuickActionCardProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient?: keyof typeof GRADIENTS;
  onPress: () => void;
  style?: ViewStyle;
  badge?: string | number;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  icon,
  gradient = 'primary',
  onPress,
  style,
  badge,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          marginVertical: SPACING.xs,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={GRADIENTS[gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            borderRadius: BORDER_RADIUS.lg,
            padding: SPACING.lg,
            minHeight: 120,
            justifyContent: 'space-between',
            position: 'relative',
          },
          SHADOWS.medium,
        ]}
      >
        {badge && (
          <View
            style={{
              position: 'absolute',
              top: SPACING.sm,
              right: SPACING.sm,
              backgroundColor: COLORS.white,
              borderRadius: BORDER_RADIUS.round,
              minWidth: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: SPACING.xs,
            }}
          >
            <Text
              style={[
                TYPOGRAPHY.overline,
                {
                  color: COLORS.primary,
                  fontSize: 10,
                  fontWeight: '700',
                },
              ]}
            >
              {badge}
            </Text>
          </View>
        )}
        
        <Ionicons
          name={icon}
          size={32}
          color={COLORS.white}
          style={{ alignSelf: 'flex-start' }}
        />
        
        <View>
          <Text
            style={[
              TYPOGRAPHY.h5,
              {
                color: COLORS.white,
                fontWeight: '600',
                marginBottom: subtitle ? SPACING.xs : 0,
              },
            ]}
          >
            {title}
          </Text>
          
          {subtitle && (
            <Text
              style={[
                TYPOGRAPHY.caption,
                {
                  color: COLORS.white,
                  opacity: 0.9,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default QuickActionCard;