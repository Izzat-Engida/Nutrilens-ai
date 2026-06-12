/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Base
    text: '#0F172A',
    background: '#F8FAFC',

    // Surfaces
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E2E8F0',

    // Secondary
    textSecondary: '#64748B',

    // Brand
    primary: '#22C55E',
    primaryLight: '#86EFAC',

    // Accent
    accent: '#38BDF8',

    // Status
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',

    // Dashboard Cards
    protein: '#22C55E',
    carbs: '#38BDF8',
    fat: '#F59E0B',
    water: '#06B6D4',

    // Borders
    border: '#E2E8F0',
  },

  dark: {
    // Base
    text: '#F8FAFC',
    background: '#0B0F14',

    // Surfaces
    backgroundElement: '#111827',
    backgroundSelected: '#1F2937',

    // Secondary
    textSecondary: '#94A3B8',

    // Brand
    primary: '#22C55E',
    primaryLight: '#4ADE80',

    // Accent
    accent: '#38BDF8',

    // Status
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',

    // Dashboard Cards
    protein: '#22C55E',
    carbs: '#38BDF8',
    fat: '#F59E0B',
    water: '#06B6D4',

    // Borders
    border: '#1E293B',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
} as const;
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  floating: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};




export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
