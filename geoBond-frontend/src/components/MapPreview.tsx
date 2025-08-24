import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

interface MapPreviewProps {
  friendsCount?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  friendsCount = 0,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: COLORS.white,
          borderRadius: BORDER_RADIUS.lg,
          padding: SPACING.lg,
          marginHorizontal: SPACING.lg,
          marginVertical: SPACING.xs,
          minHeight: 120,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        },
        SHADOWS.medium,
        style,
      ]}
      activeOpacity={0.8}
    >
      {/* Background pattern */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.primaryLight,
          opacity: 0.1,
        }}
      />
      
      {/* Mock map dots */}
      <View style={{ position: 'absolute', top: 20, left: 30 }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: COLORS.primary,
          }}
        />
      </View>
      <View style={{ position: 'absolute', top: 40, right: 40 }}>
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.accent,
          }}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 30, left: 50 }}>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: COLORS.secondary,
          }}
        />
      </View>
      
      {/* Content */}
      <Ionicons
        name="map"
        size={32}
        color={COLORS.primary}
        style={{ marginBottom: SPACING.sm }}
      />
      
      <Text
        style={[
          TYPOGRAPHY.h5,
          {
            color: COLORS.textPrimary,
            fontWeight: '600',
            marginBottom: SPACING.xs,
          },
        ]}
      >
        Live Map
      </Text>
      
      <Text
        style={[
          TYPOGRAPHY.caption,
          {
            color: COLORS.textSecondary,
            textAlign: 'center',
          },
        ]}
      >
        {friendsCount > 0
          ? `${friendsCount} friends sharing location`
          : 'No friends sharing location yet'}
      </Text>
      
      {/* View button */}
      <View
        style={{
          position: 'absolute',
          top: SPACING.md,
          right: SPACING.md,
          backgroundColor: COLORS.primary,
          borderRadius: BORDER_RADIUS.round,
          padding: SPACING.sm,
        }}
      >
        <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

export default MapPreview;