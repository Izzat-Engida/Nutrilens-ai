import { Platform } from 'react-native';

export const nutrilensTheme = {
  colors: {
    primary: '#22C55E',
    primaryHover: '#16A34A',

    background: '#0B0F14',
    surface: '#111827',

    text: '#F8FAFC',
    textSecondary: '#94A3B8',

    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',

    info: '#38BDF8',

    border: '#1E293B',

    disabled: '#475569',

    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  sizes: {
    BASE: 16,

    FONT: 16,

    ICON: 20,
    ICON_MEDIUM: 24,
    ICON_LARGE: 32,

    BUTTON_HEIGHT: 52,

    CARD_BORDER_RADIUS: 20,

    SCREEN_PADDING: 24,

    AVATAR_SM: 40,
    AVATAR_MD: 64,
    AVATAR_LG: 96,

  H1: 40,
  H2: 32,
  H3: 24,
  H4: 20,
  H5: 18,

  FONT: 16,

  BUTTON_HEIGHT: 52,
  },

  shadows: {
    sm: {
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
      },
    },

    md: {
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0,0,0,0.12)',
      },
    },

    lg: {
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.16,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0px 8px 20px rgba(0,0,0,0.16)',
      },
    },
  },
} as const;