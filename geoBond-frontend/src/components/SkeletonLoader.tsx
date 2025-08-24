import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = BORDER_RADIUS.sm,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.gray200, COLORS.gray300],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

interface SkeletonCardProps {
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ style }) => {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.white,
          borderRadius: BORDER_RADIUS.lg,
          padding: SPACING.lg,
          marginHorizontal: SPACING.lg,
          marginVertical: SPACING.xs,
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {/* Avatar skeleton */}
      <SkeletonLoader
        width={48}
        height={48}
        borderRadius={24}
        style={{ marginRight: SPACING.md }}
      />
      
      {/* Content skeleton */}
      <View style={{ flex: 1 }}>
        <SkeletonLoader
          width="60%"
          height={16}
          style={{ marginBottom: SPACING.xs }}
        />
        <SkeletonLoader
          width="40%"
          height={12}
          style={{ marginBottom: SPACING.xs }}
        />
        <SkeletonLoader
          width="80%"
          height={12}
        />
      </View>
      
      {/* Action buttons skeleton */}
      <View style={{ flexDirection: 'row' }}>
        <SkeletonLoader
          width={32}
          height={32}
          borderRadius={16}
          style={{ marginLeft: SPACING.sm }}
        />
        <SkeletonLoader
          width={32}
          height={32}
          borderRadius={16}
          style={{ marginLeft: SPACING.sm }}
        />
      </View>
    </View>
  );
};

export default SkeletonLoader;