import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import Avatar from './Avatar';

interface ActivityItemProps {
  type: 'friend_request' | 'location_share' | 'friend_accepted' | 'location_update';
  userName: string;
  userAvatar?: { uri: string };
  message: string;
  timestamp: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  userName,
  userAvatar,
  message,
  timestamp,
  onPress,
  style,
}) => {
  const getActivityIcon = () => {
    switch (type) {
      case 'friend_request':
        return 'person-add';
      case 'location_share':
        return 'location';
      case 'friend_accepted':
        return 'checkmark-circle';
      case 'location_update':
        return 'navigate';
      default:
        return 'notifications';
    }
  };

  const getActivityColor = () => {
    switch (type) {
      case 'friend_request':
        return COLORS.info;
      case 'location_share':
        return COLORS.primary;
      case 'friend_accepted':
        return COLORS.success;
      case 'location_update':
        return COLORS.accent;
      default:
        return COLORS.textSecondary;
    }
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.white,
          borderRadius: BORDER_RADIUS.md,
          padding: SPACING.md,
          marginVertical: SPACING.xs,
        },
        SHADOWS.small,
        style,
      ]}
    >
      <Avatar
        source={userAvatar}
        name={userName}
        size="small"
        style={{ marginRight: SPACING.md }}
      />
      
      <View style={{ flex: 1 }}>
        <Text style={[TYPOGRAPHY.body2, { color: COLORS.textPrimary }]}>
          <Text style={{ fontWeight: '600' }}>{userName}</Text> {message}
        </Text>
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.textTertiary, marginTop: SPACING.xs }]}>
          {timestamp}
        </Text>
      </View>
      
      <View
        style={{
          backgroundColor: getActivityColor(),
          borderRadius: BORDER_RADIUS.round,
          padding: SPACING.sm,
          marginLeft: SPACING.md,
        }}
      >
        <Ionicons
          name={getActivityIcon()}
          size={16}
          color={COLORS.white}
        />
      </View>
    </Component>
  );
};

export default ActivityItem;