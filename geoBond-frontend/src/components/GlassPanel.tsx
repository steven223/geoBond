import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { BORDER_RADIUS, SPACING, SHADOWS } from '../constants/theme';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  style, 
  intensity = 75 
}) => {
  return (
    <BlurView 
      style={[styles.glassPanel, style]} 
      intensity={intensity} 
      tint="dark"
    >
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  glassPanel: {
    backgroundColor: 'rgba(85, 84, 84, 0.73)',
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.huge,
    paddingHorizontal: SPACING.xxl,
    width: '95%',
    maxWidth: 400,
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...SHADOWS.large,
  },
});

export default GlassPanel;