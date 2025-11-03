import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, danger
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  icon = null,
  style,
}) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (disabled) {
      return [...baseStyle, styles.disabled, style];
    }
    
    return [...baseStyle, styles[variant], style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`text${size.toUpperCase()}`]];
    
    if (variant === 'outline') {
      return [...baseStyle, styles.textOutline];
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.textWhite}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
  },
  // Sizes
  sm: {
    height: 36,
    paddingHorizontal: spacing.md,
  },
  md: {
    height: 48,
  },
  lg: {
    height: 56,
    paddingHorizontal: spacing.xl,
  },
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.borderLight,
    opacity: 0.6,
  },
  // Text
  text: {
    fontWeight: fontWeight.semibold,
    color: colors.textWhite,
  },
  textSM: {
    fontSize: fontSize.sm,
  },
  textMD: {
    fontSize: fontSize.md,
  },
  textLG: {
    fontSize: fontSize.lg,
  },
  textOutline: {
    color: colors.primary,
  },
});

