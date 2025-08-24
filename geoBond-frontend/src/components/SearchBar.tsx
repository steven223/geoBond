import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  onClear?: () => void;
  autoFocus?: boolean;
  style?: ViewStyle;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search users...',
  isLoading = false,
  onClear,
  autoFocus = false,
  style,
}) => {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {isLoading && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={styles.loadingIndicator}
          />
        )}

        {value.length > 0 && !isLoading && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  loadingIndicator: {
    marginLeft: SPACING.sm,
  },
  clearButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
});

export default SearchBar;