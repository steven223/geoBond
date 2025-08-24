import React from 'react';
import { View, Image, Text, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';
import StatusIndicator from './StatusIndicator';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '',
  size = 'medium',
  showStatus = false,
  status = 'offline',
  style,
  imageStyle,
  textStyle,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 64;
      case 'xlarge':
        return 80;
      case 'medium':
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 24;
      case 'xlarge':
        return 32;
      case 'medium':
      default:
        return 18;
    }
  };

  const getStatusSize = () => {
    switch (size) {
      case 'small':
        return 'small' as const;
      case 'large':
      case 'xlarge':
        return 'large' as const;
      case 'medium':
      default:
        return 'medium' as const;
    }
  };

  const avatarSize = getSize();
  const fontSize = getFontSize();
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  };

  const statusPosition = {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
  };

  return (
    <View style={[avatarStyle, style]}>
      {source ? (
        <Image
          source={source}
          style={[
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
            imageStyle,
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            {
              fontSize,
              fontWeight: '600',
              color: COLORS.white,
            },
            textStyle,
          ]}
        >
          {initials || '?'}
        </Text>
      )}
      
      {showStatus && (
        <StatusIndicator
          status={status}
          size={getStatusSize()}
          style={statusPosition}
        />
      )}
    </View>
  );
};

export default Avatar;