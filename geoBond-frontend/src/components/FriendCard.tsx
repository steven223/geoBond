import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import Avatar from './Avatar';

interface FriendCardProps {
  name: string;
  avatar?: { uri: string };
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  location?: string;
  onPress?: () => void;
  onLocationPress?: () => void;
  onMessagePress?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  name,
  avatar,
  status,
  lastSeen,
  location,
  onPress,
  onLocationPress,
  onMessagePress,
  style,
  compact = false,
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      style={[
        {
          backgroundColor: COLORS.white,
          borderRadius: BORDER_RADIUS.lg,
          padding: compact ? SPACING.md : SPACING.lg,
          marginHorizontal: SPACING.lg,
          marginVertical: SPACING.xs,
          flexDirection: 'row',
          alignItems: 'center',
        },
        SHADOWS.medium,
        style,
      ]}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <Avatar
        source={avatar}
        name={name}
        size={compact ? 'small' : 'medium'}
        showStatus={true}
        status={status}
        style={{ marginRight: SPACING.md }}
      />
      
      <View style={{ flex: 1 }}>
        <Text
          style={[
            compact ? TYPOGRAPHY.body2 : TYPOGRAPHY.h5,
            {
              color: COLORS.textPrimary,
              fontWeight: '600',
              marginBottom: SPACING.xs,
            },
          ]}
        >
          {name}
        </Text>
        
        {location && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs }}>
            <Ionicons
              name="location"
              size={12}
              color={COLORS.textSecondary}
              style={{ marginRight: SPACING.xs }}
            />
            <Text
              style={[
                TYPOGRAPHY.caption,
                {
                  color: COLORS.textSecondary,
                  flex: 1,
                },
              ]}
              numberOfLines={1}
            >
              {location}
            </Text>
          </View>
        )}
        
        {lastSeen && status === 'offline' && (
          <Text
            style={[
              TYPOGRAPHY.caption,
              {
                color: COLORS.textTertiary,
              },
            ]}
          >
            Last seen {lastSeen}
          </Text>
        )}
        
        {status === 'online' && (
          <Text
            style={[
              TYPOGRAPHY.caption,
              {
                color: COLORS.online,
                fontWeight: '500',
              },
            ]}
          >
            Online now
          </Text>
        )}
      </View>
      
      {!compact && (
        <View style={{ flexDirection: 'row' }}>
          {onLocationPress && (
            <TouchableOpacity
              onPress={onLocationPress}
              style={{
                backgroundColor: COLORS.accent,
                borderRadius: BORDER_RADIUS.round,
                padding: SPACING.sm,
                marginLeft: SPACING.sm,
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="navigate" size={16} color={COLORS.white} />
            </TouchableOpacity>
          )}
          
          {onMessagePress && (
            <TouchableOpacity
              onPress={onMessagePress}
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: BORDER_RADIUS.round,
                padding: SPACING.sm,
                marginLeft: SPACING.sm,
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble" size={16} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </Component>
  );
};

export default FriendCard;