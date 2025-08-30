import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
    };

    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    if (score < 2) return { strength: 'Weak', color: COLORS.error, width: '25%' };
    if (score < 4) return { strength: 'Fair', color: COLORS.warning, width: '50%' };
    if (score < 5) return { strength: 'Good', color: COLORS.info, width: '75%' };
    return { strength: 'Strong', color: COLORS.success, width: '100%' };
  };

  const { strength, color, width } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={styles.strengthBar}>
        <View style={[styles.strengthFill, { backgroundColor: color, width }]} />
      </View>
      <Text style={[styles.strengthText, { color }]}>
        Password Strength: {strength}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  strengthBar: {
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    marginBottom: SPACING.xs,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
});

export default PasswordStrengthIndicator;