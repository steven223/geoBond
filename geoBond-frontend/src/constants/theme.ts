import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive dimensions
export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
};

// Responsive scaling functions
export const scale = (size: number): number => {
  const baseWidth = 375; // iPhone X width as base
  return (SCREEN_WIDTH / baseWidth) * size;
};

export const verticalScale = (size: number): number => {
  const baseHeight = 812; // iPhone X height as base
  return (SCREEN_HEIGHT / baseHeight) * size;
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Responsive font sizes
export const FONT_SIZES = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  md: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(18),
  xxl: moderateScale(20),
  xxxl: moderateScale(24),
  huge: moderateScale(28),
  massive: moderateScale(32),
};

// Colors
export const COLORS = {
  // Primary gradient colors
  primary: '#667eea',
  primaryDark: '#764ba2',
  primaryLight: '#a8b5ff',

  // Secondary colors
  secondary: '#4facfe',
  secondaryDark: '#00f2fe',

  // Accent colors
  accent: '#4fd1c7',
  accentDark: '#38b2ac',

  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',

  // Online status colors
  online: '#34C759',
  offline: '#9CA3AF',
  away: '#FF9500',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Background colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
};

// Gradients
export const GRADIENTS = {
  primary: ['#667eea', '#764ba2'],
  secondary: ['#4facfe', '#00f2fe'],
  accent: ['#4fd1c7', '#667eea'],
  success: ['#34C759', '#30D158'],
  warm: ['#ff9a9e', '#fecfef'],
  cool: ['#a8edea', '#fed6e3'],
  sunset: ['#ff9a9e', '#fad0c4'],
  ocean: ['#667eea', '#764ba2', '#4fd1c7'],
  purple: ['#667eea', '#764ba2'],
  blue: ['#4facfe', '#00f2fe'],
  teal: ['#4fd1c7', '#38b2ac'],
  warning: ['#FF9500', '#FF6B35'],
};

// Spacing
export const SPACING = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  xxxl: scale(32),
  huge: scale(40),
  massive: scale(48),
};

// Border radius
export const BORDER_RADIUS = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  round: scale(50),
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Typography
export const TYPOGRAPHY = {
  h1: {
    fontSize: FONT_SIZES.massive,
    fontWeight: '700' as const,
    lineHeight: FONT_SIZES.massive * 1.2,
  },
  h2: {
    fontSize: FONT_SIZES.huge,
    fontWeight: '700' as const,
    lineHeight: FONT_SIZES.huge * 1.2,
  },
  h3: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '600' as const,
    lineHeight: FONT_SIZES.xxxl * 1.2,
  },
  h4: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600' as const,
    lineHeight: FONT_SIZES.xxl * 1.2,
  },
  h5: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600' as const,
    lineHeight: FONT_SIZES.xl * 1.2,
  },
  h6: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600' as const,
    lineHeight: FONT_SIZES.lg * 1.2,
  },
  body1: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '400' as const,
    lineHeight: FONT_SIZES.lg * 1.5,
  },
  body2: {
    fontSize: FONT_SIZES.md,
    fontWeight: '400' as const,
    lineHeight: FONT_SIZES.md * 1.5,
  },
  caption: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '400' as const,
    lineHeight: FONT_SIZES.sm * 1.4,
  },
  overline: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500' as const,
    lineHeight: FONT_SIZES.xs * 1.4,
    textTransform: 'uppercase' as const,
  },
};

// Layout
export const LAYOUT = {
  containerPadding: SPACING.lg,
  cardPadding: SPACING.lg,
  sectionSpacing: SPACING.xxl,
  itemSpacing: SPACING.md,
};

export default {
  SCREEN_DIMENSIONS,
  scale,
  verticalScale,
  moderateScale,
  FONT_SIZES,
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  LAYOUT,
};