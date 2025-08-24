import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: keyof typeof COLORS;
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
  onPress?: () => void;
  testID?: string;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'textPrimary',
  align = 'left',
  children,
  style,
  numberOfLines,
  onPress,
  testID,
}) => {
  const textStyle = [
    styles.base,
    TYPOGRAPHY[variant],
    { color: COLORS[color] },
    { textAlign: align },
    style,
  ];

  return (
    <Text
      style={textStyle}
      numberOfLines={numberOfLines}
      onPress={onPress}
      testID={testID}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default Typography;