import React from 'react';
import { View, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'medium',
  style,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return COLORS.online;
      case 'away':
        return COLORS.away;
      case 'offline':
      default:
        return COLORS.offline;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 8;
      case 'large':
        return 16;
      case 'medium':
      default:
        return 12;
    }
  };

  const indicatorSize = getSize();

  return (
    <View
      style={[
        {
          width: indicatorSize,
          height: indicatorSize,
          borderRadius: indicatorSize / 2,
          backgroundColor: getStatusColor(),
          borderWidth: 2,
          borderColor: COLORS.white,
        },
        style,
      ]}
    />
  );
};

export default StatusIndicator;