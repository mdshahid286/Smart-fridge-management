// theme.js - Centralized Design System

export const colors = {
  // Primary colors - Professional neutral blue-gray
  primary: '#475569',      // Slate-600
  primaryDark: '#334155',  // Slate-700
  primaryLight: '#64748B', // Slate-500
  
  // Secondary colors - Subtle gray-blue
  secondary: '#64748B',    // Slate-500
  secondaryDark: '#475569', // Slate-600
  secondaryLight: '#94A3B8', // Slate-400
  
  // Accent colors - Neutral teal-gray
  accent: '#64748B',       // Slate-500
  accentDark: '#475569',   // Slate-600
  accentLight: '#94A3B8',  // Slate-400
  
  // Status colors - Subtle professional
  success: '#059669',      // Emerald-600 (darker, more professional)
  error: '#DC2626',        // Red-600 (darker)
  warning: '#D97706',      // Amber-600 (darker)
  info: '#0284C7',         // Sky-600 (darker blue)
  
  // Neutral colors - Professional gray tones
  background: '#F8FAFC',   // Slate-50
  backgroundSolid: '#F1F5F9',   // Slate-100 (very light gray)
  backgroundGradientStart: '#F8FAFC',
  backgroundGradientEnd: '#F1F5F9',
  backgroundDark: '#E2E8F0', // Slate-200
  backgroundLight: '#F8FAFC', // Slate-50
  surface: '#FFFFFF',
  card: 'rgba(255, 255, 255, 0.9)',
  cardSolid: '#FFFFFF',
  cardGlass: 'rgba(255, 255, 255, 0.85)',
  cardHover: '#F8FAFC',
  
  // Text colors
  textPrimary: '#111827',   // Gray-900
  textSecondary: '#6B7280', // Gray-500
  textDisabled: '#9CA3AF',  // Gray-400
  textWhite: '#FFFFFF',
  
  // Border colors
  border: '#E5E7EB',        // Gray-200
  borderLight: '#F3F4F6',   // Gray-100
  borderDark: '#D1D5DB',    // Gray-300
  
  // Gradients
  gradientPrimary: ['#4F46E5', '#7C3AED'],    // Indigo to Purple
  gradientSecondary: ['#14B8A6', '#3B82F6'],  // Teal to Blue
  gradientSuccess: ['#10B981', '#14B8A6'],    // Emerald to Teal
  
  // Other
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const layout = {
  screenPadding: spacing.md,
  cardPadding: spacing.md,
  buttonHeight: 48,
  inputHeight: 48,
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
};

export default {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
  layout,
};

