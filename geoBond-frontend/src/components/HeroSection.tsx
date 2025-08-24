import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, GRADIENTS } from '../constants/theme';
import GradientBackground from './GradientBackground';
import Avatar from './Avatar';

interface HeroSectionProps {
  userName: string;
  userAvatar?: { uri: string };
  greeting?: string;
  subtitle?: string;
  style?: ViewStyle;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userName,
  userAvatar,
  greeting,
  subtitle,
  style,
}) => {
  const getGreeting = () => {
    if (greeting) return greeting;
    
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <GradientBackground
      gradient="primary"
      style={[
        {
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.xxxl,
          paddingBottom: SPACING.xxl,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar
          source={userAvatar}
          name={userName}
          size="large"
          showStatus={true}
          status="online"
          style={{ marginRight: SPACING.lg }}
        />
        
        <View style={{ flex: 1 }}>
          <Text
            style={[
              TYPOGRAPHY.body1,
              {
                color: COLORS.white,
                opacity: 0.9,
                marginBottom: SPACING.xs,
              },
            ]}
          >
            {getGreeting()},
          </Text>
          
          <Text
            style={[
              TYPOGRAPHY.h2,
              {
                color: COLORS.white,
                fontWeight: '700',
                marginBottom: subtitle ? SPACING.xs : 0,
              },
            ]}
          >
            {userName}!
          </Text>
          
          {subtitle && (
            <Text
              style={[
                TYPOGRAPHY.body2,
                {
                  color: COLORS.white,
                  opacity: 0.8,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </GradientBackground>
  );
};

export default HeroSection;